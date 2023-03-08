export function getFormValue<T>(form: FormData, name: string): T | null {
  const value = form.get(name)
  if (!value) return null
  return form.get(name) as T
}
