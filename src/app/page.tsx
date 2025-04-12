// src/app/page.tsx
import GrammarCorrector from "@/components/GrammarCorrector";

export default function Home() {
	return (
		<div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white">
						Grammar Correction & Tweet
					</h1>
					<p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
						Improve your grammar and share your thoughts on Twitter
					</p>
				</div>

				<GrammarCorrector />
			</div>
		</div>
	);
}
