import React from 'react'

function Loader() {
    return (
        <section className='flex items-center justify-center'>
            <div
                className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"
            />
        </section>
    )
}

export default Loader