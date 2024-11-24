export function CustomSelect({
    id,
    name,
    options,
    required
  }: {
    id: string;
    name: string;
    options: Array<{ value: string; label: string }>;
    required?: boolean;
  }) {
    return (
      <select
        id={id}
        name={name}
        required={required}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  