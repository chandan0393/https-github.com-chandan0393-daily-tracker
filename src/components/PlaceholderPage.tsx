import { PageHeader } from './PageHeader'
import { Sparkles } from 'lucide-react'
import { IconTile } from './IconTile'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="page placeholder-page">
      <PageHeader title={title} subtitle={description} />
      <div className="placeholder-panel neu-card-raised">
        <div className="placeholder-tile-wrap">
          <IconTile
            icon={<Sparkles size={28} strokeWidth={2.2} />}
            variant="lavender"
            size="lg"
            interactive={false}
          />
        </div>
        <h2>{title} Module</h2>
        <p className="placeholder-desc">
          This tracking module is prepared in the aesthetic neumorphic shell.
          Quick glance data is already syncing through your <strong>Dashboard</strong> widgets.
        </p>
        <div className="placeholder-tag neu-chip">
          <span>✨ Soft Pastel Neumorphism</span>
        </div>
      </div>
    </section>
  )
}

