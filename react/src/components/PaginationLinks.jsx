export default function PaginationLinks({ meta, onPageClick }) {

  function onClick(ev, link) {
    ev.preventDefault();
    if (!link.url) {
      return;
    }
    onPageClick(link)
  }

  const previousLink = meta.links[0];
  const nextLink = meta.links[meta.links.length - 1];

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow-md mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={ev => onClick(ev, previousLink)}
          disabled={!previousLink.url}
          className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium
            ${!previousLink.url 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-whitetext-gray-700 hover:bg-gray-50'}`}
        >
          Previous
        </button>
        <button
          onClick={ev => onClick(ev, nextLink)}
          disabled={!nextLink.url}
          className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium
            ${!nextLink.url
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{meta.from}</span> to{" "}
            <span className="font-medium">{meta.to}</span> of{" "}
            <span className="font-medium">{meta.total}</span> results
          </p>
        </div>
        <div>
          {meta.total > meta.per_page && <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {meta.links && meta.links.map((link, ind) => (
                <button
                  onClick={ev => onClick(ev, link)}
                  key={ind}
                  aria-current="page"
                  disabled={!link.url}
                  className={
                    "relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 hover:bg-gray-50 "
                    + (ind === 0 ? 'rounded-l-md ' : '')
                    + (ind === meta.links.length - 1 ? 'rounded-r-md ' : '')
                    + (link.active ? 'z-10 border-sky-500 bg-sky-50 text-sky-600 ' : '')
                    + (!link.url ? ' bg-gray-200 text-gray-400 cursor-not-allowed' : '')
                  }
                  dangerouslySetInnerHTML={{ __html: link.label }}
                >
                </button>
              ))}
            </nav>
            }
        </div>
      </div>
    </div>
  );
}