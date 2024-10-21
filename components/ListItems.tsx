import * as React from 'react'
import { Item, SortOption } from '../types'
import Loader from './Loader';


export default function ListItems() {
    const [items, setItems] = React.useState<Item[]>([]);
    const [sortOption, setSortOption] = React.useState<SortOption>('createdAtAsc');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/fetchListData');

            if (!response.ok) {
                throw new Error('Failed to fetch CSV data');
            }

            const data = await response.json();
            setItems(data);

        } catch (err) {
            setError('An error occurred while fetching CSV data. Please try again.');
            console.error('Error fetching CSV:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSort = (option: SortOption) => {

        setSortOption(option);

        const sortedItems = [...items].sort((a, b) => {
            switch (option) {
                case 'createdAtAsc':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'filenameAsc':
                    return sortFilename(a.filename, b.filename);
                case 'filenameDesc':
                    return sortFilename(b.filename, a.filename);
                default:
                    return 0;
            }
        });

        setItems(sortedItems);
    };

    const sortFilename = (a: string, b: string) => {
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;

        const regex = /(\d+)|(\D+)/g;
        const aParts = a.match(regex) || [];
        const bParts = b.match(regex) || [];

        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
            const aValue = aParts[i];
            const bValue = bParts[i];
            const aNum = parseInt(aValue);
            const bNum = parseInt(bValue);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                if (aNum !== bNum) return aNum - bNum;
            } else {
                const compare = aValue.localeCompare(bValue);
                if (compare !== 0) return compare;
            }
        }

        return aParts.length - bParts.length;
    };

    // console.log(items)

    return (
        <section className='py-20 lg:px-10 px-5'>

            <div className='flex flex-col items-center justify-center mb-10'>
                <select
                    onChange={(e) => handleSort(e.target.value as SortOption)}
                    value={sortOption}
                    disabled={isLoading}
                    className="bg-black mt-1.5 mb-5 p-5 shadow-lg rounded-lg border-1 border-indigo-500/100 text-white sm:text-sm"
                >
                    <option value="createdAtAsc">Sort by Created At (Ascending)</option>
                    <option value="filenameAsc">Sort by Filename (Ascending)</option>
                    <option value="filenameDesc">Sort by Filename (Descending)</option>
                </select>

                <button
                    onClick={fetchData} disabled={isLoading}
                    className="flex justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {
                error && <p className='text-red-500'>
                    {error}
                </p>
            }

            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                    {items?.map((item, index) => (
                        <div key={index} className="h-32 p-5 rounded-lg bg-black shadow-md">
                            <p className='text-white'> {item.createdAt} </p>
                            <p className='text-white'>{item.filename}</p>
                        </div>
                    ))}
                </div>
            )}

        </section>
    )
}
