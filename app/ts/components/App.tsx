import { ReadonlySignal } from '@preact/signals'
import { sleep } from '../library/utilities.js'
import { asyncSwitch, useAsyncState } from '../library/preact-utilities.js'
import { Spinner } from './Spinner.js'

export interface AppModel {
	readonly greeting: ReadonlySignal<string>
	readonly cycleGreeting: () => void
}

export function App(model: AppModel) {
	const { value: subject, waitFor: waitForSubject, reset: resetSubject } = useAsyncState<'World'>()

	async function updateSubject() {
		await sleep(1000)
		return 'World' as const
	}

	async function updateSubjectWithFailure(): Promise<'World'> {
		await sleep(100)
		throw new Error(`Uh oh, you broke it!`)
	}

	function GoodButton() {
		return <button style={{ backgroundColor: 'lightgreen' }} onClick={() => waitForSubject(updateSubject)}>Good Button</button>
	}

	function BadButton() {
		return <button style={{ backgroundColor: 'coral' }} onClick={() => waitForSubject(updateSubjectWithFailure)}>Bad Button</button>
	}

	function ResetButton() {
		return <button onClick={resetSubject}>↻</button>
	}

	return asyncSwitch(subject.value, {
		inactive: <main>Waiting for someone to click a button. <GoodButton/><BadButton/></main>,
		pending: <main><Spinner/> Don't click the bad button! <BadButton/></main>,
		rejected: error => <main>{error.message} I guess you need to start over, try again: <ResetButton/></main>,
		resolved: value => <main><button onClick={model.cycleGreeting}>{model.greeting}</button> {value}! <ResetButton/></main>,
	})
}
