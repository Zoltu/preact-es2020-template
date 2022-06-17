import { sleep } from '../library/utilities'
import { useAsyncState } from '../library/preact-utilities'
import { Spinner } from './Spinner'

export interface AppModel {
	readonly cycleSubject: () => void
	greeting: string
}

export function App(model: AppModel) {
	const [ subject, querySubject, resetSubject ] = useAsyncState<'World'>()

	async function updateSubject() {
		await sleep(1000)
		return 'World' as const
	}

	async function updateSubjectWithFailure(): Promise<'World'> {
		await sleep(100)
		throw new Error(`Uh oh, you broke it!`)
	}

	function GoodButton() {
		return <button style={{ backgroundColor: 'lightgreen' }} onClick={() => querySubject(updateSubject)}>Good Button</button>
	}

	function BadButton() {
		return <button style={{ backgroundColor: 'coral' }} onClick={() => querySubject(updateSubjectWithFailure)}>Bad Button</button>
	}

	function ResetButton() {
		return <button onClick={resetSubject}>↻</button>
	}

	switch (subject.state) {
		case 'inactive':
			return <main>Waiting for someone to click a button. <GoodButton/><BadButton/></main>
		case 'pending':
			return <main><Spinner/> Don't click the bad button! <BadButton/></main>
		case 'rejected':
			return <main>{subject.error.message} I guess you need to start over, try again: <ResetButton/></main>
		case 'resolved':
			return <main><button onClick={model.cycleSubject}>{model.greeting}</button> {subject.value}! <ResetButton/></main>
	}
}
