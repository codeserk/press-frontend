import { FormInstance } from 'antd'

/**
 * Returns whether the form contains any field with errors
 * @param form
 * @returns whether there are errors
 */
export function formHasError(form: FormInstance<any>): boolean {
  return form.getFieldsError().filter((item) => item.errors.length > 0).length > 0
}
