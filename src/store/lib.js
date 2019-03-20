import dayjs from 'dayjs'

export function getEntryMeta(entry) {
  const name = entry.name.replace(/.md/g, '')
  const date = name.substring(0, 10)
  const url = `/${entry.path.replace(/.md/g, '')}`
  const src = `/${formatEntrySrc(entry.path)}`
  const dateFormatted = dayjs(date).format('MMM DD,YYYY')
  return {
    name, date, src, url, dateFormatted,
  }
}

export function formatEntrySrc(str) {
  return str.substring(str.length - 2, str.length) === 'md'
    ? str
    : `${str}/readme.md`
}
