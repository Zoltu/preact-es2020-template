import * as preactHooks from 'preact/hooks'
export type Inactive = { state: 'inactive' }
export type Pending = { state: 'pending' }
export type Resolved<T> = { state: 'resolved', value: T }
export type Rejected = { state: 'rejected', error: Error }
export type AsyncProperty<T> = Inactive | Pending | Resolved<T> | Rejected

export function useAsyncState<T>(resolver?: () => Promise<T>): [AsyncProperty<T>, (resolver: () => Promise<T>) => void, () => void] {
	async function activate(resolver: () => Promise<T>, skipPendingSet: boolean = false) {
		try {
			if (!skipPendingSet) {
				const pendingState = { state: 'pending' as const }
				setResult(pendingState)
			}
			const resolvedValue = await resolver()
			const resolvedState = { state: 'resolved' as const, value: resolvedValue }
			setResult(resolvedState)
		} catch (unknownError: unknown) {
			const error = unknownError instanceof Error ? unknownError : new Error(`Unknown error occurred.`)
			const rejectedState = { state: 'rejected' as const, error }
			setResult(rejectedState)
		}
	}
	function reset() {
		setResult({ state: 'inactive' })
	}
	const [ result, setResult ] = (resolver === undefined)
		? preactHooks.useState<AsyncProperty<T>>(() => ({ state: 'inactive' }))
		: preactHooks.useState<AsyncProperty<T>>(() => { activate(resolver, true); return { state: 'pending' } })
	return [ result, resolver => activate(resolver), reset ]
}
