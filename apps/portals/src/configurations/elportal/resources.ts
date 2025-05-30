export const dataSql = 'SELECT * FROM syn51228429'
export const dataOnStudiesPageSql =
  "SELECT * FROM syn51228429 WHERE `resourceType` = 'metadata'"
export const peopleSql = 'SELECT * FROM syn51209684'
export const projectsSql = 'SELECT * FROM syn51209786'
export const publicationsSql = 'SELECT * FROM syn51407023'
export const studiesSql = 'SELECT * FROM syn51209885 ORDER BY isFeatured DESC'
export const speciesSql = 'SELECT * FROM syn51449110 ORDER BY ItemOrder'
export const computationalSql = 'SELECT * FROM syn51469335'
export const upsetPlotSql = 'SELECT files, assay FROM syn51581771'
export const cohortBuilderSql = 'SELECT * FROM syn52234652'
export const cohortBuilderFilesSql = 'SELECT * FROM syn52234677'

export const defaultSearchConfiguration = {
  fullTextSearchHelpURL: 'https://help.eliteportal.org/help/search-tips',
}
