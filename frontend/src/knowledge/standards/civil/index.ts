import type {
  EngineeringStandardFamily,
  EngineeringStandardsRegistry,
} from "../../types/EngineeringStandard";
import { ENGINEERING_STANDARD_FAMILY_KEYS } from "../../types/EngineeringStandard";
import {
  buildStandardsRegistry,
  createStandardDocument,
} from "../../utils/buildStandardsRegistry";

const ircFamily: EngineeringStandardFamily = {
  key: ENGINEERING_STANDARD_FAMILY_KEYS.irc,
  label: "IRC",
  description:
    "Indian Roads Congress codes for highway planning, geometric design, pavements, bridges, and traffic engineering.",
  documents: [
    createStandardDocument(
      "irc-37",
      "IRC:37",
      "Guidelines for Design of Flexible Pavements",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Pavement layer design for flexible pavements using CBR and traffic data.",
      "highway-engineering",
      "irc-37"
    ),
    createStandardDocument(
      "irc-58",
      "IRC:58",
      "Guidelines for Design of Plain Jointed Rigid Pavements",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Rigid pavement thickness and joint design for highways.",
      "highway-engineering",
      "irc-58"
    ),
    createStandardDocument(
      "irc-86",
      "IRC:86",
      "Geometric Design Standards for Urban Highways",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Urban highway alignment and intersection geometric parameters.",
      "highway-engineering",
      "irc-86"
    ),
    createStandardDocument(
      "irc-73",
      "IRC:73",
      "Geometric Design Standards for Rural Highways",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Rural and hill road geometric design including sight distance and superelevation.",
      "highway-engineering",
      "irc-73"
    ),
    createStandardDocument(
      "irc-6",
      "IRC:6",
      "Standard Specifications and Code of Practice for Road Bridges",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Load standards and general bridge design requirements.",
      "bridge-engineering"
    ),
    createStandardDocument(
      "irc-21",
      "IRC:21",
      "Standard Specifications and Code of Practice for Cement Concrete Road Bridges",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Concrete bridge design and construction specifications."
    ),
    createStandardDocument(
      "irc-112",
      "IRC:112",
      "Code of Practice for Concrete Road Bridges",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Limit state design for concrete road bridges."
    ),
    createStandardDocument(
      "irc-66",
      "IRC:66",
      "Recommended Practice for Sight Distance on Highways",
      ENGINEERING_STANDARD_FAMILY_KEYS.irc,
      "Stopping and overtaking sight distance requirements.",
      "highway-engineering"
    ),
  ],
};

const morthFamily: EngineeringStandardFamily = {
  key: ENGINEERING_STANDARD_FAMILY_KEYS.morth,
  label: "MoRTH",
  description:
    "Ministry of Road Transport and Highways specifications for national highway works.",
  documents: [
    createStandardDocument(
      "morth-specs",
      "MORTH",
      "Specifications for Road and Bridge Works",
      ENGINEERING_STANDARD_FAMILY_KEYS.morth,
      "Technical specifications for earthwork, pavement, drainage, and structures on national highways.",
      "highway-engineering",
      "morth"
    ),
    createStandardDocument(
      "morth-sor",
      "MORTH SOR",
      "Schedule of Rates",
      ENGINEERING_STANDARD_FAMILY_KEYS.morth,
      "Standard schedule of rates for national highway construction and maintenance."
    ),
    createStandardDocument(
      "morth-qc",
      "MORTH QC",
      "Quality Control Manual",
      ENGINEERING_STANDARD_FAMILY_KEYS.morth,
      "Field quality assurance and testing requirements for highway projects."
    ),
  ],
};

const isFamily: EngineeringStandardFamily = {
  key: ENGINEERING_STANDARD_FAMILY_KEYS.is,
  label: "IS Codes",
  description:
    "Bureau of Indian Standards codes for materials, testing, and structural design.",
  documents: [
    createStandardDocument(
      "is-456",
      "IS:456",
      "Plain and Reinforced Concrete — Code of Practice",
      ENGINEERING_STANDARD_FAMILY_KEYS.is,
      "Concrete mix design, durability, and structural design provisions."
    ),
    createStandardDocument(
      "is-800",
      "IS:800",
      "General Construction in Steel — Code of Practice",
      ENGINEERING_STANDARD_FAMILY_KEYS.is,
      "Steel structure design and fabrication requirements."
    ),
    createStandardDocument(
      "is-2386",
      "IS:2386",
      "Methods of Test for Aggregates for Concrete",
      ENGINEERING_STANDARD_FAMILY_KEYS.is,
      "Aggregate testing for concrete and bituminous mixes.",
      "highway-engineering",
      "is-2386"
    ),
    createStandardDocument(
      "is-383",
      "IS:383",
      "Coarse and Fine Aggregate for Concrete",
      ENGINEERING_STANDARD_FAMILY_KEYS.is,
      "Gradation and quality requirements for concrete aggregates."
    ),
    createStandardDocument(
      "is-2720",
      "IS:2720",
      "Methods of Test for Soils",
      ENGINEERING_STANDARD_FAMILY_KEYS.is,
      "Soil classification, compaction, and CBR testing methods."
    ),
  ],
};

const astmFamily: EngineeringStandardFamily = {
  key: ENGINEERING_STANDARD_FAMILY_KEYS.astm,
  label: "ASTM",
  description:
    "ASTM International standards referenced for materials testing and pavement evaluation.",
  documents: [
    createStandardDocument(
      "astm-d6927",
      "ASTM D6927",
      "Standard Test Method for Marshall Stability and Flow",
      ENGINEERING_STANDARD_FAMILY_KEYS.astm,
      "Marshall stability testing for bituminous mix design."
    ),
    createStandardDocument(
      "astm-c131",
      "ASTM C131",
      "Standard Test Method for Resistance to Degradation of Small-Size Coarse Aggregate",
      ENGINEERING_STANDARD_FAMILY_KEYS.astm,
      "Los Angeles abrasion test for aggregate durability."
    ),
    createStandardDocument(
      "astm-d1557",
      "ASTM D1557",
      "Standard Test Methods for Laboratory Compaction",
      ENGINEERING_STANDARD_FAMILY_KEYS.astm,
      "Modified Proctor compaction for soil and subgrade evaluation."
    ),
  ],
};

const aashtoFamily: EngineeringStandardFamily = {
  key: ENGINEERING_STANDARD_FAMILY_KEYS.aashto,
  label: "AASHTO",
  description:
    "American Association of State Highway and Transportation Officials reference standards.",
  documents: [
    createStandardDocument(
      "aashto-m145",
      "AASHTO M145",
      "Standard Specification for Classification of Soils",
      ENGINEERING_STANDARD_FAMILY_KEYS.aashto,
      "Soil classification system for highway subgrade evaluation."
    ),
    createStandardDocument(
      "aashto-t180",
      "AASHTO T180",
      "Standard Method of Test for Moisture-Density Relations",
      ENGINEERING_STANDARD_FAMILY_KEYS.aashto,
      "Modified compaction test for pavement subgrade materials."
    ),
    createStandardDocument(
      "aashto-t193",
      "AASHTO T193",
      "Standard Method of Test for California Bearing Ratio",
      ENGINEERING_STANDARD_FAMILY_KEYS.aashto,
      "CBR testing for flexible pavement design correlation."
    ),
  ],
};

export const civilEngineeringStandardsRegistry: EngineeringStandardsRegistry =
  buildStandardsRegistry("civil-engineering", "Civil Engineering", [
    ircFamily,
    morthFamily,
    isFamily,
    astmFamily,
    aashtoFamily,
  ]);
