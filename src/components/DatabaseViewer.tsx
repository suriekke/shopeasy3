import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface TableInfo {
  table_name: string
  record_count: number
}

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
}

const DatabaseViewer: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [columns, setColumns] = useState<ColumnInfo[]>([])
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .order('table_name')

      if (error) throw error

      // Get record count for each table
      const tableCounts = await Promise.all(
        data.map(async (table) => {
          const { count } = await supabase
            .from(table.table_name)
            .select('*', { count: 'exact', head: true })
          
          return {
            table_name: table.table_name,
            record_count: count || 0
          }
        })
      )

      setTables(tableCounts)
    } catch (error) {
      console.error('Error fetching tables:', error)
    }
  }

  const fetchTableDetails = async (tableName: string) => {
    setLoading(true)
    setSelectedTable(tableName)

    try {
      // Get columns
      const { data: columnsData, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .order('ordinal_position')

      if (columnsError) throw columnsError
      setColumns(columnsData)

      // Get sample data
      const { data: tableData, error: dataError } = await supabase
        .from(tableName)
        .select('*')
        .limit(10)

      if (dataError) throw dataError
      setData(tableData)
    } catch (error) {
      console.error('Error fetching table details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Database Tables Viewer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Tables</h2>
          <div className="space-y-2">
            {tables.map((table) => (
              <button
                key={table.table_name}
                onClick={() => fetchTableDetails(table.table_name)}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                  selectedTable === table.table_name ? 'bg-blue-100' : ''
                }`}
              >
                <div className="font-medium">{table.table_name}</div>
                <div className="text-sm text-gray-600">
                  {table.record_count} records
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Table Details */}
        {selectedTable && (
          <>
            {/* Columns */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Columns - {selectedTable}
              </h2>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-2">
                  {columns.map((column) => (
                    <div key={column.column_name} className="p-2 border rounded">
                      <div className="font-medium">{column.column_name}</div>
                      <div className="text-sm text-gray-600">
                        {column.data_type} {column.is_nullable === 'YES' ? '(nullable)' : '(not null)'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sample Data */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Sample Data - {selectedTable}
              </h2>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {columns.map((column) => (
                          <th key={column.column_name} className="text-left p-2">
                            {column.column_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index} className="border-b">
                          {columns.map((column) => (
                            <td key={column.column_name} className="p-2">
                              {row[column.column_name]?.toString() || 'null'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DatabaseViewer
