const variants: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
  urgent: 'bg-red-100 text-red-700',
  in_progress: 'bg-blue-100 text-blue-700'
}

export default function StatusTag({ status }: { status: keyof typeof variants }) {
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${variants[status]}`}>{status}</span>
  )
}
