/*
# Bioinformatics Career Hub — Database Schema

## Purpose
A career exploration platform for bioinformatics students to discover career paths, view details, and bookmark roles of interest.

## New Tables

### 1. careers
Stores bioinformatics career paths with detailed information.
- id (uuid, PK)
- title (text) — e.g. "Bioinformatics Scientist"
- slug (text, unique) — URL-friendly identifier
- summary (text) — short one-line description
- description (text) — full detailed description
- category (text) — e.g. "Research", "Industry", "Clinical", "Data Science"
- experience_level (text) — "Entry", "Mid", "Senior"
- salary_range (text) — e.g. "$70,000 - $95,000"
- key_skills (text[]) — array of skills
- tools (text[]) — array of tools/technologies
- education (text) — recommended education path
- responsibilities (text[]) — day-to-day responsibilities
- growth_outlook (text) — career growth description
- icon_name (text) — lucide icon name for display
- created_at (timestamptz)

### 2. bookmarks
Stores user-saved career bookmarks (single-tenant, no auth).
- id (uuid, PK)
- career_id (uuid, FK to careers)
- created_at (timestamptz)

## Security
- RLS enabled on both tables.
- Both tables use `TO anon, authenticated` since this is a no-auth public app.
- All CRUD operations allowed for anon + authenticated (data is intentionally public/shared).
*/

CREATE TABLE IF NOT EXISTS careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  experience_level text NOT NULL DEFAULT 'Entry',
  salary_range text NOT NULL,
  key_skills text[] NOT NULL DEFAULT '{}',
  tools text[] NOT NULL DEFAULT '{}',
  education text NOT NULL,
  responsibilities text[] NOT NULL DEFAULT '{}',
  growth_outlook text NOT NULL,
  icon_name text NOT NULL DEFAULT 'FlaskConical',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_careers" ON careers;
CREATE POLICY "anon_select_careers" ON careers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_careers" ON careers;
CREATE POLICY "anon_insert_careers" ON careers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_careers" ON careers;
CREATE POLICY "anon_update_careers" ON careers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_careers" ON careers;
CREATE POLICY "anon_delete_careers" ON careers FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookmarks" ON bookmarks;
CREATE POLICY "anon_select_bookmarks" ON bookmarks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookmarks" ON bookmarks;
CREATE POLICY "anon_insert_bookmarks" ON bookmarks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookmarks" ON bookmarks;
CREATE POLICY "anon_delete_bookmarks" ON bookmarks FOR DELETE
  TO anon, authenticated USING (true);

-- Seed career data
INSERT INTO careers (title, slug, summary, description, category, experience_level, salary_range, key_skills, tools, education, responsibilities, growth_outlook, icon_name) VALUES
(
  'Bioinformatics Scientist',
  'bioinformatics-scientist',
  'Design algorithms and pipelines to analyze genomic and proteomic data.',
  'Bioinformatics Scientists sit at the intersection of biology and computer science. They develop computational methods to analyze large biological datasets — from genome sequences to protein structures — and translate findings into biological insights. They work in academia, pharma, and biotech, often leading research projects and publishing papers.',
  'Research',
  'Mid',
  '$85,000 - $120,000',
  ARRAY['Genomics','Algorithm design','Statistics','Python','Data mining','Molecular biology'],
  ARRAY['BLAST','BioPython','R','Galaxy','Nextflow','Docker'],
  'PhD in Bioinformatics, Computational Biology, or related field. Masters acceptable in industry.',
  ARRAY['Design and optimize bioinformatics pipelines','Analyze next-generation sequencing data','Collaborate with wet-lab biologists','Publish research findings','Maintain reproducible workflows'],
  'Strong demand in pharma and biotech as genomic data volumes grow. AI/ML integration expanding opportunities.',
  'FlaskConical'
),
(
  'Computational Biologist',
  'computational-biologist',
  'Model biological systems using computational and mathematical approaches.',
  'Computational Biologists build mathematical models of biological systems — from signaling pathways to population genetics. They use simulation, modeling, and statistical analysis to understand complex biological phenomena. Often found in research institutes and pharma R&D departments.',
  'Research',
  'Mid',
  '$80,000 - $115,000',
  ARRAY['Mathematical modeling','Systems biology','Statistics','Python','R','Machine learning'],
  ARRAY['MATLAB','SimBiology','Cytoscape','PySB','COPASI'],
  'PhD in Computational Biology, Applied Math, or Bioinformatics.',
  ARRAY['Develop computational models of biological systems','Run simulations to test hypotheses','Analyze multi-omics data','Collaborate with experimental biologists','Write grant proposals'],
  'Growing as systems biology and multi-omics data become mainstream in drug discovery.',
  'Brain'
),
(
  'Genomics Data Analyst',
  'genomics-data-analyst',
  'Process and interpret genomic sequencing data for clinical or research use.',
  'Genomics Data Analysts work with next-generation sequencing data — running pipelines, performing QC, calling variants, and interpreting results. They bridge the gap between raw sequencing output and actionable biological or clinical insights. Found in clinical genomics labs, research cores, and biotech companies.',
  'Clinical',
  'Entry',
  '$55,000 - $80,000',
  ARRAY['Variant calling','QC analysis','Genomics','Bash scripting','Statistics'],
  ARRAY['GATK','Samtools','BCFtools','R','IGV','Linux command line'],
  'Bachelors or Masters in Bioinformatics, Genetics, or related field.',
  ARRAY['Run NGS analysis pipelines','Perform quality control on sequencing data','Call and annotate genetic variants','Generate reports for clinicians or researchers','Troubleshoot pipeline failures'],
  'High demand as clinical genomics and precision medicine expand rapidly.',
  'Dna'
),
(
  'Biocurator',
  'biocurator',
  'Organize, annotate, and maintain biological databases for research communities.',
  'Biocurators are the librarians of the biological data world. They collect, organize, and annotate biological information into structured databases like UniProt, ClinVar, and Gene Ontology. Their work ensures that researchers worldwide can find and trust the data they use. Critical for data quality and reproducibility in life sciences.',
  'Research',
  'Entry',
  '$50,000 - $70,000',
  ARRAY['Data annotation','Ontology','Literature review','Attention to detail','SQL'],
  ARRAY['UniProt','Gene Ontology','ClinVar','ChEMBL','PostgreSQL','Protéomics tools'],
  'Masters in Bioinformatics, Biology, or Library Science with biology focus.',
  ARRAY['Annotate biological entities from literature','Maintain and update database records','Ensure data quality and consistency','Develop curation guidelines','Respond to user feedback on data'],
  'Steady demand, especially in government databases and large consortia.',
  'Database'
),
(
  'Drug Discovery Data Scientist',
  'drug-discovery-data-scientist',
  'Apply ML and data science to accelerate pharmaceutical drug discovery.',
  'Drug Discovery Data Scientists use machine learning and statistical modeling to identify potential drug candidates, predict protein-ligand interactions, and optimize lead compounds. They work at pharma companies and AI-drug-discovery startups, turning biological and chemical data into therapeutic candidates.',
  'Industry',
  'Senior',
  '$110,000 - $160,000',
  ARRAY['Machine learning','Cheminformatics','Molecular modeling','Python','Deep learning','Pharmacology'],
  ARRAY['RDKit','PyTorch','TensorFlow','Schrödinger Suite','Pandas','Scikit-learn'],
  'PhD in Chemistry, Bioinformatics, or Computer Science with drug discovery focus.',
  ARRAY['Build ML models for target identification','Predict molecular properties and toxicity','Analyze high-throughput screening data','Collaborate with medicinal chemists','Deploy models into drug discovery pipelines'],
  'Explosive growth — AI-driven drug discovery is one of the hottest fields in biotech.',
  'Pill'
),
(
  'Clinical Bioinformatician',
  'clinical-bioinformatician',
  'Analyze patient genomic data to support clinical diagnostics and precision medicine.',
  'Clinical Bioinformaticians work in hospital and clinical lab settings, analyzing patient sequencing data to diagnose genetic conditions, identify pathogenic variants, and support treatment decisions. They must follow clinical standards (CLIA, CAP) and work closely with geneticists and clinicians. A direct impact on patient care.',
  'Clinical',
  'Mid',
  '$75,000 - $105,000',
  ARRAY['Clinical genomics','Variant interpretation','HGVS nomenclature','QC','Regulatory compliance'],
  ARRAY['Variant Interpreter','GATK','Samtools','LOVD','ClinVar','Apollo'],
  'Masters in Bioinformatics or Clinical Genetics. Certification (e.g. ABMGG) often required.',
  ARRAY['Analyze clinical NGS data for variant detection','Interpret pathogenicity of genetic variants','Generate clinical reports for geneticists','Maintain CLIA/CAP compliance','Participate in tumor boards'],
  'Rapidly growing as clinical genomics becomes standard of care in oncology and rare disease.',
  'Stethoscope'
),
(
  'Bioinformatics Software Engineer',
  'bioinformatics-software-engineer',
  'Build software tools, platforms, and pipelines for the genomics community.',
  'Bioinformatics Software Engineers develop the tools that other bioinformaticians use — from pipeline frameworks like Nextflow to analysis platforms like Galaxy. They combine strong software engineering skills with biological domain knowledge to create scalable, user-friendly bioinformatics software.',
  'Industry',
  'Mid',
  '$90,000 - $135,000',
  ARRAY['Software engineering','Python','API design','Cloud computing','CI/CD','Docker'],
  ARRAY['Nextflow','Snakemake','AWS','Kubernetes','FastAPI','React'],
  'Bachelors or Masters in Computer Science with bioinformatics experience, or vice versa.',
  ARRAY['Design and build bioinformatics software tools','Develop scalable analysis pipelines','Maintain open-source bioinformatics projects','Write documentation and tests','Collaborate with researcher-users'],
  'Strong — as bioinformatics moves to cloud and enterprise, demand for robust software grows.',
  'Code'
),
(
  'Precision Medicine Analyst',
  'precision-medicine-analyst',
  'Integrate genomic and clinical data to guide personalized treatment strategies.',
  'Precision Medicine Analysts combine genomic data with electronic health records, clinical data, and treatment outcomes to identify the best therapies for individual patients. They work in academic medical centers, precision medicine startups, and pharma, often at the cutting edge of translational research.',
  'Clinical',
  'Mid',
  '$80,000 - $115,000',
  ARRAY['Genomics','Clinical data integration','Statistics','EHR systems','Machine learning'],
  ARRAY['FHIR','HL7','OMOP CDM','R','Python','SQL'],
  'Masters in Bioinformatics, Epidemiology, or Biomedical Informatics.',
  ARRAY['Integrate genomic and clinical datasets','Build predictive models for treatment response','Develop precision medicine workflows','Collaborate with clinicians and researchers','Present findings to clinical teams'],
  'High growth — precision medicine is a national priority in many countries.',
  'Activity'
),
(
  'Metagenomics Analyst',
  'metagenomics-analyst',
  'Analyze microbial community data from environmental and clinical samples.',
  'Metagenomics Analysts study microbial communities — the microbiome — by analyzing bulk sequencing data from environmental or clinical samples. They identify species, profile abundance, and study community dynamics. Applications range from gut health to environmental monitoring to agriculture.',
  'Research',
  'Entry',
  '$60,000 - $85,000',
  ARRAY['Metagenomics','Microbiome analysis','Taxonomy','Statistics','Python'],
  ARRAY['QIIME2','MetaPhlAn','HUMAnN','R','Kraken2'],
  'Masters in Bioinformatics, Microbiology, or related field.',
  ARRAY['Process and analyze metagenomic sequencing data','Profile microbial community composition','Study microbiome-host interactions','Generate visualizations of community data','Collaborate with microbiologists'],
  'Growing fast — microbiome research is expanding into therapeutics, agriculture, and diagnostics.',
  'Microscope'
),
(
  'Structural Bioinformatician',
  'structural-bioinformatician',
  'Predict and analyze 3D protein structures and molecular interactions.',
  'Structural Bioinformaticians use computational methods to predict, model, and analyze the 3D structures of proteins and other biomolecules. With the rise of AlphaFold and deep learning, this field has been revolutionized. They work in drug design, enzyme engineering, and fundamental biology research.',
  'Research',
  'Senior',
  '$95,000 - $140,000',
  ARRAY['Protein structure','Molecular dynamics','Deep learning','Homology modeling','Python'],
  ARRAY['AlphaFold','PyMOL','GROMACS','Rosetta','PyTorch','ChimeraX'],
  'PhD in Structural Biology, Bioinformatics, or Computational Chemistry.',
  ARRAY['Predict and refine protein structures','Run molecular dynamics simulations','Analyze protein-ligand interactions','Design proteins and enzymes','Collaborate with experimental structural biologists'],
  'Very strong — AlphaFold revolution created massive interest in AI-powered structural biology.',
  'Atom'
),
(
  'Bioinformatics Educator',
  'bioinformatics-educator',
  'Teach bioinformatics concepts and skills to students and professionals.',
  'Bioinformatics Educators train the next generation of computational biologists. They develop curricula, teach courses, create online tutorials, and run workshops. Found in universities, online platforms, and industry training programs. Essential for building the workforce that the field needs.',
  'Industry',
  'Mid',
  '$60,000 - $95,000',
  ARRAY['Teaching','Curriculum design','Bioinformatics','Communication','Workshop facilitation'],
  ARRAY['RStudio Cloud','Galaxy','Jupyter','Google Colab','Canvas'],
  'Masters or PhD in Bioinformatics or related field. Teaching experience preferred.',
  ARRAY['Develop bioinformatics course curricula','Teach workshops and courses','Create online tutorials and materials','Mentor students and trainees','Stay current with tools and methods'],
  'Steady — as demand for bioinformatics skills grows, so does demand for qualified educators.',
  'GraduationCap'
),
(
  'Regulatory Bioinformatics Specialist',
  'regulatory-bioinformatics-specialist',
  'Ensure bioinformatics workflows meet FDA, EMA, and other regulatory standards.',
  'Regulatory Bioinformatics Specialists ensure that computational workflows used in drug development and clinical diagnostics comply with regulatory requirements. They validate pipelines, maintain documentation, and interface with regulatory agencies. Critical for any bioinformatics work that supports regulatory submissions.',
  'Industry',
  'Senior',
  '$100,000 - $140,000',
  ARRAY['Regulatory affairs','Validation','Documentation','GxP compliance','Bioinformatics'],
  ARRAY['JIRA','Veeva Vault','Git','Docker','Confluence'],
  'Masters in Bioinformatics or Regulatory Affairs with bioinformatics experience.',
  ARRAY['Validate bioinformatics pipelines for regulatory compliance','Maintain documentation for audits','Interface with FDA, EMA, and other agencies','Develop SOPs for computational workflows','Train teams on regulatory requirements'],
  'Growing as regulatory bodies increase scrutiny of computational methods in drug development.',
  'ShieldCheck'
)
ON CONFLICT (slug) DO NOTHING;
