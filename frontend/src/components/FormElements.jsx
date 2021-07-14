import { ErrorMessage } from 'formik';

export function TextInput(props) {
  return (
    <InputField
      type="text"
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

  const classes = props.classes + ` appearance-none block bg-gray-100 text-gray-700
                        border border-indigo-500 rounded py-3 px-4 leading-tight
                        focus:outline-none focus:bg-white ` 
  
  return (
    <label>
      <div className="block uppercase text-xs font-bold mb-2 flex">
        {props.title}
      </div>
      <div className="mb-3">
        <div className="flex items-center">
          <div>
            {/* set size to something large because it overwrites width*/}
            <input className={classes} {...props}/>
          </div>
          <div className="font-semibold">
            {props.suffix}
          </div>
        </div>
        <ErrorMessage name={props.name} component="div" className="text-xs text-red-500 italic mt-2"/>
      </div>
    </label>
  )
}

export function OptionSelect(props){
  return(
    <div className="py-3">
      <div className="block uppercase text-xs font-bold mb-2 flex">
        {props.title}
      </div>
      <div className="relative">
          <select
            className={`block appearance-none w-full bg-gray-100
                    border border-indigo-500 text-gray-700 py-3
                    px-4 pr-8 rounded leading-tight
                    focus:outline-none focus:bg-white focus:border-gray-500`}
            {...props}
            >
            {props.options.map(option => <option>{option}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
      </div>
    </div>
  )
}