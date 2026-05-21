import type { ComponentType } from 'react'
import { Drop, People, TickCircle, Warning2 } from 'iconsax-reactjs'

export interface StatItem {
  label: string
  value: string
  change: string
  positive: boolean
  icon: any // iconsax icon component
  color: string
}

export function StatsOverview({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon size={16} variant="Bold" color="currentColor" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>
              {stat.change}
            </p>
          </div>
        )
      })}
    </div>
  )
}
