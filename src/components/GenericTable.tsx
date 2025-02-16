interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode) ;
  }
  
  interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
  }
  
  const GenericTable = <T,>({ columns, data }: TableProps<T>) => {
    console.log(data)
    return (
      <table className="table-auto w-full border-collapse border border-secondary">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="border border-secondary px-4 py-5">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-center">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="border border-secondary px-4 py-2">
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        
      </table>
    );
  };
  
  export default GenericTable;
  