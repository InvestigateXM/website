export interface NumberCandidateExtractor {
  regexp: RegExp
  parseFunction: (m: RegExpMatchArray) => number | undefined
  baseScoreFunction: (s: string) => number
}

export interface NumberMarker extends PositionMarker {
  type: string
  parsed: number
}

export interface PositionMarker {
  start: number
  raw: string
}

export interface IntermediateMissionExtractionResult {
  title: string
  remainingNumberCandidates: NumberMarker[] | undefined
  remainingTitleCandidates: PositionMarker[] | undefined
  missionMarker: NumberMarker | undefined
  totalMarker: NumberMarker | undefined
  titleMarker: PositionMarker | undefined
}

export interface IntermediateExtractionResult {
  total: number | undefined
  title: string | undefined
  results: IntermediateMissionExtractionResult[]
}

export interface MissionExtractionResult {
  missionMarker: NumberMarker | undefined
  totalMarker: NumberMarker | undefined
  titleMarker: PositionMarker | undefined
}

export interface NumberExtractionResult {
  index: number | undefined
  total: number | undefined
}

export interface ExtractionResult {
  total: number | undefined
  title: string | undefined
  results: Array<MissionExtractionResult>
}

export interface Title {
  val: string
  missions: Array<string>
  pos: Array<number>
}

export interface IntermediateMissionNumber {
  index: number | undefined
  raw: string | undefined
  total: number | undefined
  markersClean: Array<NumberMarker>
  markers: Array<NumberMarker>
}

export interface TitleDictionary {
  [val: string]: Title
}
