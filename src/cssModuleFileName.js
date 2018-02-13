/**
 * find css module file name from request
 *
 * @flow
 */

export default function sliceCssModule(request: string): string {
  const lastIndex = request.lastIndexOf('!')
  return request.substr(lastIndex + 1)
}
