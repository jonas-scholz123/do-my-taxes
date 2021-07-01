import { ErrorMessage } from 'formik';

export function TextInput(props) {
  return (
    <InputField
      type="text"
      classes="w-full"
      {...props}
    />
  )
}

export function NumberInput(props) {
  return (
    <InputField
      type="number"
      {...props}
    />
  )
}

export function InputField(props){

  const classes = `appearance-none block bg-gray-100 text-gray-700
                        border border-indigo-500 rounded py-3 px-4 leading-tight
                        focus:outline-none focus:bg-white ` + props.classes

  return (
    <label>
      <div class="block uppercase text-xs font-bold mb-2 flex">
        {props.title}
      </div>
      <div class="mb-3">
        <input class={classes} {...props}/>
        <ErrorMessage name={props.name} component="div" class="text-xs text-red-500 italic mt-2"/>
      </div>
    </label>
  )
}

export function OptionSelect(props){
  return(
    <div class="py-3">
      <div class="block uppercase text-xs font-bold mb-2 flex">
        {props.title}
      </div>
      <div class="relative">
          <select
            class={`block appearance-none w-full bg-gray-100
                    border border-indigo-500 text-gray-700 py-3
                    px-4 pr-8 rounded leading-tight
                    focus:outline-none focus:bg-white focus:border-gray-500`}
            {...props}
            >
            {props.options.map(option => <option>{option}</option>)}
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
      </div>
    </div>
  )
}