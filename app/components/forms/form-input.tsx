export default function FormInput({ icon, label, id, name, ...props }: {
    icon?: any,
    label: string,
    id: string,
    name: string;
    [key: string]: any
}) {
    return (
        <div className={`relative flex flex-col space-y-3 ${props.className ? props.className : ''}`}>
            <label className="font-semibold text-xs text-gray-500/80 tracking-widest uppercase"
                   htmlFor={id}
            >
                {label}
            </label>

            <input type="text"
                   name={name}
                   id={id} {...props}
                   className={`w-full px-4 py-3 font-medium text-gray-500 border ${props.error ? 'border-red-500' : 'border-qc-bronze/50'}`}
            />

            {icon && !props.error && (
                <div className="absolute bottom-3.5 right-0 flex items-center pr-3">
                    {icon}
                </div>
            )}

            {props.error && (
                <>
                    <span className="text-red-500 text-xs font-medium tracking-widest">
                        {props.error}
                    </span>
                </>
            )}
        </div>
    );
}