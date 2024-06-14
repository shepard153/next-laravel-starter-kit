export default function SubmitButton({ text, disabled }: {
    text: string,
    disabled: boolean
}) {
    return (
        <button type="submit"
                className={`px-6 py-4 text-base text-white tracking-widest uppercase ${disabled ? 'bg-sky-500/50' : 'bg-sky-500'} `}
                disabled={disabled}
        >
            {text}
        </button>
    )
}