import { useAsyncState } from '../library/preact-utilities'
import { Spinner } from './Spinner'

async function sleep(milliseconds: number) {
	await new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function App() {
	const [ greeting, queryGreeting, resetGreeting ] = useAsyncState<'Hello'>()

	async function updateGreeting() {
		await sleep(1000)
		return 'Hello' as const
	}

	async function updateGreetingWithFailure(): Promise<'Hello'> {
		await sleep(100)
		throw new Error(`Uh oh, you broke it!`)
	}

	function GoodButton() {
		return <button style={{ backgroundColor: 'lightgreen' }} onClick={() => queryGreeting(updateGreeting)}>Good Button</button>
	}

	function BadButton() {
		return <button style={{ backgroundColor: 'coral' }} onClick={() => queryGreeting(updateGreetingWithFailure)}>Bad Button</button>
	}

	function ResetButton() {
		return <button onClick={resetGreeting}>↻</button>
	}

	switch (greeting.state) {
		case 'inactive':
			return <main>Waiting for someone to click a button. <GoodButton/><BadButton/></main>
		case 'pending':
			return <main><Spinner/> Don't click the bad button! <BadButton/></main>
		case 'rejected':
			return <main>{greeting.error.message} I guess you need to start over, try again: <ResetButton/></main>
		case 'resolved':
			return <main>{greeting.value} World! <ResetButton/></main>
	}
}
