interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RecordPage({ params }: PageProps) {
  const { id } = await params

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <h1 className="text-4xl font-bold tracking-tight">Record View</h1>
      <p className="text-xl text-muted-foreground">
        Viewing details for record ID: <span className="font-mono text-primary">{id}</span>
      </p>
      <div className="bg-card w-full max-w-3xl rounded-xl border p-8 shadow-sm text-center">
        <p className="text-muted-foreground mb-4">
          All other information (transcript, generated blog, media players) will be presented here.
        </p>
      </div>
    </div>
  )
}
