type Command = { name: string, options?: Object | string }

export class Mangudai {
  private readonly sections: {[x: string]: Command[]} = {}
  addCommand (section: string, name: string, options: Object = {}): this {
    this.sections[section] = this.sections[section] || []
    this.sections[section].push({ name, options })
    return this
  }

  toString (): string {
    return Object.keys(this.sections)
      .map(name => this.serializeSection(name))
      .join('\n\n') + '\n'
  }

  private serializeCommand ({ name, options }: Command): string {
    let result = name
    if (typeof options === 'string') {
      result += ` ${options}`
    } else {
      const keys = Object.keys(options)
      if (keys.length) {
        result += ['', '{', ...keys.map(key => `  ${key} ${options[key]}`), '}', ''].join('\n')
      }
    }
    return result
  }

  private serializeSection (name: string): string {
    return `<${name}>\n${this.sections[name].map(c => this.serializeCommand(c)).join('\n')}`
  }
}
