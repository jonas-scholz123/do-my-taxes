export default function ShowMoreButton(props) {
    return (
        <div class="flex">
        <button class="block uppercase text-sm font-bold text-gray-700 hover:text-indigo-700 hover:underline" type="button" onClick={() => props.onClick()}>
          Show More
        </button>
        <div class="flex items-center">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    )
}