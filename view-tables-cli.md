# View Tables via Supabase CLI

## Install Supabase CLI
```bash
npm install -g supabase
```

## Login to Supabase
```bash
supabase login
```

## Link your project
```bash
supabase link --project-ref YOUR_PROJECT_ID
```

## View tables
```bash
# List all tables
supabase db list tables

# View table structure
supabase db describe TABLE_NAME

# Example:
supabase db describe products
supabase db describe categories
supabase db describe orders
```

## View data in tables
```bash
# View all records in a table
supabase db query "SELECT * FROM products LIMIT 10;"

# View table count
supabase db query "SELECT COUNT(*) FROM products;"
```

