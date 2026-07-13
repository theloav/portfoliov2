import { Component } from 'react'

/**
 * Isolates a decorative/heavy subtree. If it throws, we render `fallback`
 * (default: nothing) instead of blanking the whole page. Lesson from v1.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error(`[ErrorBoundary:${this.props.name || 'unnamed'}]`, error, info)
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
