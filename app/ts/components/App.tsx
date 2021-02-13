export interface AppModel {
	readonly cycleGreeting: () => void
	greeting: string
	subject: string
}

export function App(model: Readonly<AppModel>) {
	return <main>
		<div>{model.greeting} {model.subject}</div>
		<button onClick={model.cycleGreeting}>Change</button>
	</main>
}
