import React from 'react'

export default function SectionHeader({title, subtitle, action}) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <div className="muted">{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}
