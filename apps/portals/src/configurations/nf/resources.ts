export const datasetsSql = 'SELECT * FROM syn50913342.4'
export const publicationsSql = 'SELECT * FROM syn16857542'
export const studiesSql = 'SELECT * FROM syn16787123'
export const initiativesSql = 'SELECT * FROM syn24189696'
export const toolsSql = 'SELECT * FROM syn51730943'
export const peopleSql = 'SELECT * FROM syn23564971'
export const filesSql = `SELECT name, resourceType, assay, dataType, diagnosis, tumorType,  species, individualID,  fileFormat, dataSubtype, nf1Genotype as "NF1 Genotype", nf2Genotype as "NF2 Genotype", studyName, fundingAgency, consortium, accessType, accessTeam, Resource_id FROM syn16858331.89 WHERE resourceType in ('experimentalData', 'results', 'analysis')`
export const metadataFilesSql = `SELECT id, resourceType, dataType, assay, diagnosis, tumorType, species, individualID, fileFormat, dataSubtype, nf1Genotype, nf2Genotype, fundingAgency, consortium FROM syn16858331.89 where resourceType in ('metadata','report')`
export const fundersSql = 'SELECT * FROM syn16858699'
export const hackathonsSql = 'SELECT * FROM syn25585549'
export const observationsSql =
  'SELECT observationSubmitterName as "submitterName", synapseId as "submitterUserId", observationTime as "time", observationTimeUnits as "timeUnits", observationText as "text", observationType as "tag" FROM syn51735464'
export const investigatorSql = `SELECT investigatorName as "firstName", ' ' as "lastName", institution, investigatorSynapseId as "USERID" FROM syn51734029 WHERE (investigatorName IS NOT NULL OR investigatorSynapseId IS NOT NULL)`
export const developmentPublicationSql = `SELECT * FROM syn51735467`
export const fundingAgencySql = `SELECT funderName as "Funding Agency" FROM syn51734076`
export const usageRequirementsSql = `SELECT usageRequirements as "Usage Restrictions" FROM syn26450069 WHERE usageRequirements IS NOT NULL`
export const vendorSql = `SELECT vendorName as "Vendor", vendorUrl as "Vendor Url" FROM syn51735470 WHERE vendorName IS NOT NULL`
export const catalogNumberSql = `SELECT catalogNumber as "Catalog Number", catalogNumberURL as "Catalog Number URL" FROM syn51735470 WHERE catalogNumber IS NOT NULL`
export const toolApplicationsSql = `SELECT applications as "Tool Applications" FROM syn26470588 WHERE applications IS NOT NULL`
export const toolStudySql = `SELECT * FROM syn26461958`
export const mutationsSql =
  'SELECT externalMutationID, alleleType, mutationType, mutationMethod, affectedGeneSymbol, affectedGeneName, sequenceVariation, proteinVariation, animalModelMutation, humanClinVarMutation, chromosome FROM syn26450014'
export const publicationsV2Sql = 'SELECT * FROM syn51735450'
export const popularSearchesSql =
  'SELECT displayText, fullTextSearch FROM syn26436892'
