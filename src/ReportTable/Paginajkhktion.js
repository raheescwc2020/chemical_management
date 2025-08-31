import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ length, postsPerPage, handlePagination, currentPage }) => {
    const totalPages = Math.ceil(length / postsPerPage);
    const paginationNumbers = [];

    for (let i = 1; i <= 10; i++) {
        paginationNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination flex justify-center mt-4">
            <button
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 border rounded-md disabled:opacity-50"
            >
                &laquo; Prev
            </button>

            {paginationNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => handlePagination(pageNumber)}
                    className={`mx-1 px-3 py-1 border rounded-md ${pageNumber === currentPage ? 'bg-indigo-600 text-white' : ''}`}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-1 px-3 py-1 border rounded-md disabled:opacity-50"
            >
                Next &raquo;
            </button>
        </div>
    );
};

Pagination.propTypes = {
    length: PropTypes.number.isRequired,
    postsPerPage: PropTypes.number.isRequired,
    handlePagination: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
};

export default Pagination;