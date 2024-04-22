export class LanguageHelp {
	private usages: string = null!;
	private extendedHelp: string = null!;
	private explainedUsage: string = null!;
	private possibleFormats: string = null!;
	private examples: string = null!;
	private reminder: string = null!;

	public setUsages(text: string) {
		this.usages = text;
		return this;
	}

	public setExplainedUsage(text: string) {
		this.explainedUsage = text;
		return this;
	}

	public setExtendedHelp(text: string) {
		this.extendedHelp = text;
		return this;
	}

	public setPossibleFormats(text: string) {
		this.possibleFormats = text;
		return this;
	}

	public setExamples(text: string) {
		this.examples = text;
		return this;
	}

	public setReminder(text: string) {
		this.reminder = text;
		return this;
	}

	public display(name: string, options: LanguageHelpDisplayOptions) {
		const { usages = [], extendedHelp, explainedUsage = [], possibleFormats = [], examples = [], reminder } = options;
		const output: string[] = [];

		// Usages
		if (usages.length) {
			output.push(this.usages, ...usages.map((usage) => `→ /${name}${usage.length === 0 ? '' : ` *${usage}*`}`), '');
		}

		// Extended help
		if (extendedHelp) {
			output.push(this.extendedHelp, extendedHelp, '');
		}

		// Explained usage
		if (explainedUsage.length) {
			output.push(this.explainedUsage, ...explainedUsage.map(([arg, desc]) => `→ **${arg}**: ${desc}`), '');
		}

		// Possible formats
		if (possibleFormats.length) {
			output.push(this.possibleFormats, ...possibleFormats.map(([type, example]) => `→ **${type}**: ${example}`), '');
		}

		// Examples
		if (examples.length) {
			output.push(this.examples, ...examples.map((example) => `→ /${name}${example ? ` *${example}*` : ''}`), '');
		} else {
			output.push(this.examples, `→ /${name}`, '');
		}

		// Reminder
		if (reminder) {
			output.push(this.reminder, reminder);
		}

		return output.join('\n');
	}
}

export interface LanguageHelpDisplayOptions {
	usages?: string[];
	extendedHelp?: string;
	explainedUsage?: [string, string][];
	possibleFormats?: [string, string][];
	examples?: (null | string)[];
	reminder?: string;
}
