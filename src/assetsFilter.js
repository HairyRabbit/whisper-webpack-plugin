/**
 * assets filter
 *
 * @flow
 */

export default function assetsFilter<T>(asset: T): boolean  {
  const name = asset.name
  if(asset.name.match(/hot/)) {
    return true
  }

  return true
}
