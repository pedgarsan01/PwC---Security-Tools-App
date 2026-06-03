import { SwitchReportComponent } from './components/SwitchReport';
import { getPaloAltoAdvisories } from './lib/sources/palo-alto-advisories';
import { getCortexAgentReleases } from './lib/sources/cortex-agent-releases';
import { getMicrosoftAdvisories } from './lib/sources/microsoft-advisories';
import { getSplunkAdvisories } from './lib/sources/splunk-advisories';
import type { ReleaseType, SourceResult, Vendor } from './lib/types';

// Bucket the data per-vendor / per-release-type so the UI can be a thin renderer.
export type VendorBuckets = {
	[V in Vendor]: Partial<Record<ReleaseType, SourceResult>>;
};

export default async function Home() {
	const [paloAdvisories, cortexAgent, msAdvisories, splunkAdvisories] = await Promise.all([
		getPaloAltoAdvisories(),
		getCortexAgentReleases(),
		getMicrosoftAdvisories(),
		getSplunkAdvisories(),
	]);

	const data: VendorBuckets = {
		'palo-alto': {
			'agent-release': cortexAgent,
			advisory: paloAdvisories,
		},
		microsoft: {
			advisory: msAdvisories,
		},
		splunk: {
			advisory: splunkAdvisories,
		},
	};

	return (
		<main className='min-h-screen px-4 py-6'>
			<header className='mx-auto mb-6 flex max-w-6xl flex-col gap-1'>
				<h1 className='text-2xl font-semibold'>Security Tools Release Hub</h1>
				<p className='text-sm text-slate-600 dark:text-slate-400'>
					Centralised release notes &amp; security advisories across vendors.
				</p>
			</header>
			<div className='mx-auto max-w-6xl'>
				<SwitchReportComponent data={data} />
			</div>
		</main>
	);
}
