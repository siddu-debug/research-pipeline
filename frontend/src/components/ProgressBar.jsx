export default function ProgressBar({ progress, status }) {
  const color = status === 'done' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-indigo-500'
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">
          {status === 'connecting' ? 'Connecting...' : status === 'running' ? 'Pipeline running...' :
           status === 'done' ? 'Complete!' : status === 'error' ? 'Error' : ''}
        </span>
        <span className="text-white font-mono font-bold">{progress}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
