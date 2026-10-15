# Sources

All sources were accessed on 2026-10-14.

## Databases and search queries

| Database | Query | Records |
|---|---|---|
| ClinicalTrials.gov API v2 (`https://clinicaltrials.gov/api/v2/studies`) | `query.intr=lisdexamfetamine OR Vyvanse OR SPD489 OR NRP104`, `filter.advanced=AREA[StudyType]INTERVENTIONAL`. Extra checks with the terms lisdexamphetamine, Elvanse, Tyvense, S-877503, LDX. | 119 |
| PubMed E-utilities (`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`) | `(lisdexamfetamine[tiab] OR lisdexamphetamine[tiab] OR vyvanse[tiab] OR elvanse[tiab] OR SPD489[tiab] OR NRP104[tiab]) AND placebo[tiab] AND (randomized[tiab] OR randomised[tiab] OR randomly[tiab] OR "randomized controlled trial"[pt])` | 155 |
| Web search | Searches for trials outside the two databases (Australian and Iranian registries, conference abstracts) | — |

ClinicalTrials.gov data come from the study record JSON: `https://clinicaltrials.gov/api/v2/studies/<NCT number>`.

## Included trials

"Data source" names the source of the AE numbers in `adverse_events.csv`.

### Adult ADHD

| ID | Publication | Registry | Data source |
|---|---|---|---|
| ADHD-01 | Adler LA, et al. Double-blind, placebo-controlled study of the efficacy and safety of lisdexamfetamine dimesylate in adults with ADHD. *J Clin Psychiatry*. 2008;69(9):1364-73. [PMID 19012818](https://pubmed.ncbi.nlm.nih.gov/19012818/). Full text: [addadult.com PDF](https://addadult.com/wp-content/uploads/2014/01/Adler-303-Primary-Manuscript-J-Clin-Psych-2008.pdf) | [NCT00334880](https://clinicaltrials.gov/study/NCT00334880) | Publication (Tables 1, 3, 5; text) |
| ADHD-02 | Wigal T, et al. Randomized, double-blind, placebo-controlled, crossover study ... simulated adult workplace environment design. *Behav Brain Funct*. 2010;6:34. [PMID 20576091](https://pubmed.ncbi.nlm.nih.gov/20576091/), [PMC2908054](https://pmc.ncbi.nlm.nih.gov/articles/PMC2908054/) | [NCT00697515](https://clinicaltrials.gov/study/NCT00697515) | Publication (crossover-phase table) |
| ADHD-03 | Brams M, et al. Maintenance of efficacy of lisdexamfetamine dimesylate in adults with ADHD: randomized withdrawal design. *J Clin Psychiatry*. 2012;73(7):977-83. [PMID 22780921](https://pubmed.ncbi.nlm.nih.gov/22780921/) | [NCT00877487](https://clinicaltrials.gov/study/NCT00877487) | Registry results; abstract |
| ADHD-04 | Adler LA, et al. Lisdexamfetamine dimesylate in adults with ADHD who report clinically significant impairment in executive function. *J Clin Psychiatry*. 2013;74(7):694-702. [PMID 23945447](https://pubmed.ncbi.nlm.nih.gov/23945447/) | [NCT01101022](https://clinicaltrials.gov/study/NCT01101022) | Registry results |
| ADHD-05 | Martin PT, et al. Randomized, double-blind, placebo-controlled, crossover study of the effects of LDX and mixed amphetamine salts on cognition throughout the day in adults with ADHD. *Clin Drug Investig*. 2014;34(2):147-57. [PMID 24297663](https://pubmed.ncbi.nlm.nih.gov/24297663/), [PMC3899471](https://pmc.ncbi.nlm.nih.gov/articles/PMC3899471/) | [NCT01010750](https://clinicaltrials.gov/study/NCT01010750) | Registry results |
| ADHD-06 | Biederman J, et al. The effects of lisdexamfetamine dimesylate on the driving performance of young adults with ADHD. *J Psychiatr Res*. 2012;46(4):484-91. [PMID 22277301](https://pubmed.ncbi.nlm.nih.gov/22277301/) | [NCT00801229](https://clinicaltrials.gov/study/NCT00801229) | Registry results |
| ADHD-07 | DuPaul GJ, et al. Double-blind, placebo-controlled, crossover study of the efficacy and safety of lisdexamfetamine dimesylate in college students with ADHD. *J Atten Disord*. 2012;16(3):202-20. [PMID 22166471](https://pubmed.ncbi.nlm.nih.gov/22166471/) | [NCT01342445](https://clinicaltrials.gov/study/NCT01342445) | Registry results |
| ADHD-08 | Kollins SH, et al. A pilot study of lis-dexamfetamine dimesylate (LDX/SPD489) to facilitate smoking cessation in nicotine-dependent adults with ADHD. *J Atten Disord*. 2014;18(2):158-68. [PMID 22508760](https://pubmed.ncbi.nlm.nih.gov/22508760/), [PMC3421044](https://pmc.ncbi.nlm.nih.gov/articles/PMC3421044/) | [NCT00736255](https://clinicaltrials.gov/study/NCT00736255) | Registry results |
| ADHD-09 | Waxmonsky JG, et al. Does pharmacological treatment of ADHD in adults enhance parenting performance? *CNS Drugs*. 2014;28(7):665-77. [PMID 24796970](https://pubmed.ncbi.nlm.nih.gov/24796970/) | [NCT01127607](https://clinicaltrials.gov/study/NCT01127607) | Registry results |
| ADHD-10 | Gordon CT, et al. Efficacy of lisdexamfetamine dimesylate for promoting occupational success in adolescents and young adults with ADHD. *Exp Clin Psychopharmacol*. 2021;29(4):308-318. [PMID 32297783](https://pubmed.ncbi.nlm.nih.gov/32297783/) | [NCT03446885](https://clinicaltrials.gov/study/NCT03446885) | Registry results |
| ADHD-11 | Adler LA, et al. A placebo-controlled trial of lisdexamfetamine in the treatment of comorbid sluggish cognitive tempo and adult ADHD. *J Clin Psychiatry*. 2021;82(4):20m13687. [PMID 34232582](https://pubmed.ncbi.nlm.nih.gov/34232582/). Full text: [psychiatrist.com](https://www.psychiatrist.com/jcp/a-placebo-controlled-trial-of-lisdexamfetamine-in-the-treatment-of-comorbid-sluggish-cognitive-tempo-and-adult-adhd/) | [NCT02635035](https://clinicaltrials.gov/study/NCT02635035) | Publication (the registry has no placebo-arm AE data) |

### Binge-eating disorder

| ID | Publication | Registry | Data source |
|---|---|---|---|
| BED-01 | McElroy SL, et al. Efficacy and safety of lisdexamfetamine for treatment of adults with moderate to severe binge-eating disorder. *JAMA Psychiatry*. 2015;72(3):235-46. [PMID 25587645](https://pubmed.ncbi.nlm.nih.gov/25587645/) | [NCT01291173](https://clinicaltrials.gov/study/NCT01291173) | Registry results; abstract |
| BED-02, BED-03 | McElroy SL, et al. Lisdexamfetamine dimesylate for adults with moderate to severe binge eating disorder: results of two pivotal phase 3 randomized controlled trials. *Neuropsychopharmacology*. 2016;41(5):1251-60. [PMID 26346638](https://pubmed.ncbi.nlm.nih.gov/26346638/), [PMC4793109](https://pmc.ncbi.nlm.nih.gov/articles/PMC4793109/) | [NCT01718483](https://clinicaltrials.gov/study/NCT01718483), [NCT01718509](https://clinicaltrials.gov/study/NCT01718509) | Registry results; abstract |
| BED-04 | Hudson JI, et al. Efficacy of lisdexamfetamine in adults with moderate to severe binge-eating disorder: a randomized clinical trial. *JAMA Psychiatry*. 2017;74(9):903-910. [PMID 28700805](https://pubmed.ncbi.nlm.nih.gov/28700805/), [PMC5710231](https://pmc.ncbi.nlm.nih.gov/articles/PMC5710231/) | [NCT02009163](https://clinicaltrials.gov/study/NCT02009163) | Registry results |
| BED-05 | Guerdjikova AI, et al. Lisdexamfetamine dimesylate in binge eating disorder: a placebo controlled trial. *Hum Psychopharmacol*. 2016;31(5):382-91. [PMID 27650406](https://pubmed.ncbi.nlm.nih.gov/27650406/) | [NCT01090713](https://clinicaltrials.gov/study/NCT01090713) | Abstract only (full text paywalled) |
| BED-06 | Grilo CM, et al. Lisdexamfetamine maintenance treatment for binge-eating disorder following successful treatments. *Psychol Med*. 2024;54(12):3334-3344. [PMID 39258475](https://pubmed.ncbi.nlm.nih.gov/39258475/), [PMC11496227](https://pmc.ncbi.nlm.nih.gov/articles/PMC11496227/) | [NCT03926052](https://clinicaltrials.gov/study/NCT03926052) | Registry results; abstract |
| BED-07 | Schneider E, et al. The effects of lisdexamfetamine dimesylate on eating behaviour and homeostatic, reward and cognitive processes in women with binge-eating symptoms. *Transl Psychiatry*. 2022;12(1):9. [PMID 35013131](https://pubmed.ncbi.nlm.nih.gov/35013131/), [PMC8744047](https://pmc.ncbi.nlm.nih.gov/articles/PMC8744047/) | [NCT04181957](https://clinicaltrials.gov/study/NCT04181957) | Publication |

### Other indications

| ID | Publication | Registry | Data source |
|---|---|---|---|
| OTH-01 | Trivedi MH, et al. A randomized controlled trial of the efficacy and safety of lisdexamfetamine dimesylate as augmentation therapy in adults with residual symptoms of MDD after treatment with escitalopram. *J Clin Psychiatry*. 2013;74(8):802-9. [PMID 24021497](https://pubmed.ncbi.nlm.nih.gov/24021497/) | [NCT00905424](https://clinicaltrials.gov/study/NCT00905424) | Registry results; abstract |
| OTH-02 | Madhoo M, et al. Lisdexamfetamine dimesylate augmentation in adults with persistent executive dysfunction after partial or full remission of MDD. *Neuropsychopharmacology*. 2014;39(6):1388-98. [PMID 24309905](https://pubmed.ncbi.nlm.nih.gov/24309905/), [PMC3988542](https://pmc.ncbi.nlm.nih.gov/articles/PMC3988542/) | [NCT00985725](https://clinicaltrials.gov/study/NCT00985725) | Registry results; abstract |
| OTH-03, OTH-04 | Richards C, et al. Lisdexamfetamine dimesylate augmentation for adults with MDD and inadequate response to antidepressant monotherapy: results from 2 phase 3 studies. *J Affect Disord*. 2016;206:151-160. [PMID 27474961](https://pubmed.ncbi.nlm.nih.gov/27474961/) | [NCT01436149](https://clinicaltrials.gov/study/NCT01436149), [NCT01436162](https://clinicaltrials.gov/study/NCT01436162) | Registry results |
| OTH-05 | Richards C, et al. A randomized, double-blind, placebo-controlled, dose-ranging study of lisdexamfetamine dimesylate augmentation for MDD in adults. *J Psychopharmacol*. 2017;31(9):1190-1203. [PMID 28857719](https://pubmed.ncbi.nlm.nih.gov/28857719/), [PMC5606302](https://pmc.ncbi.nlm.nih.gov/articles/PMC5606302/) | [NCT01435759](https://clinicaltrials.gov/study/NCT01435759) | Registry results; abstract |
| OTH-06 | No publication found (McLean Hospital) | [NCT01148979](https://clinicaltrials.gov/study/NCT01148979) | Registry results |
| OTH-07 | McElroy SL, et al. Adjunctive lisdexamfetamine in bipolar depression: a preliminary randomized, placebo-controlled trial. *Int Clin Psychopharmacol*. 2015;30(1):6-13. [PMID 25340384](https://pubmed.ncbi.nlm.nih.gov/25340384/) | [NCT01093963](https://clinicaltrials.gov/study/NCT01093963) | Abstract only (full text paywalled) |
| OTH-08 | Lasser RA, et al. Adjunctive lisdexamfetamine dimesylate therapy in adult outpatients with predominant negative symptoms of schizophrenia. *Neuropsychopharmacology*. 2013;38(11):2140-9. [PMID 23756608](https://pubmed.ncbi.nlm.nih.gov/23756608/), [PMC3773663](https://pmc.ncbi.nlm.nih.gov/articles/PMC3773663/) | [NCT00922272](https://clinicaltrials.gov/study/NCT00922272) | Registry results |
| OTH-09 | Martin P, et al. Safety and pharmacokinetics of lisdexamfetamine dimesylate in adults with clinically stable schizophrenia. *J Clin Psychopharmacol*. 2014;34(6):682-9. [PMID 25310201](https://pubmed.ncbi.nlm.nih.gov/25310201/) | [NCT01457339](https://clinicaltrials.gov/study/NCT01457339) | Registry results; abstract |
| OTH-10 | Mooney ME, et al. Pilot study of the effects of lisdexamfetamine on cocaine use: a randomized, double-blind, placebo-controlled trial. *Drug Alcohol Depend*. 2015;153:94-103. [PMID 26116930](https://pubmed.ncbi.nlm.nih.gov/26116930/), [PMC4509923](https://pmc.ncbi.nlm.nih.gov/articles/PMC4509923/) | [NCT00958282](https://clinicaltrials.gov/study/NCT00958282) | Publication (Table 2); registry for serious AEs |
| OTH-11 | Ezard N, et al. Lisdexamfetamine in the treatment of methamphetamine dependence: a randomised, placebo-controlled trial. *Addiction*. 2025;120(7):1345-1359. [PMID 39701142](https://pubmed.ncbi.nlm.nih.gov/39701142/), [PMC12128569](https://pmc.ncbi.nlm.nih.gov/articles/PMC12128569/) | ACTRN12617000657325 | Publication (Table 3) |
| OTH-12 | Morrow SA, et al. Lisdexamfetamine dimesylate improves processing speed and memory in cognitively impaired MS patients: a phase II study. *J Neurol*. 2013;260(2):489-97. [PMID 23001556](https://pubmed.ncbi.nlm.nih.gov/23001556/) | [NCT01615887](https://clinicaltrials.gov/study/NCT01615887) | Registry results; abstract |
| OTH-13 | Tavajohi R, et al. Assessment of the efficacy of lisdexamfetamine on fatigue in patients with multiple sclerosis. *Mult Scler Relat Disord*. 2025;101:106589. [PMID 40582077](https://pubmed.ncbi.nlm.nih.gov/40582077/) | IRCT (number not verified) | Abstract only; no AE data |
| OTH-14 | Young JL. Use of lisdexamfetamine dimesylate in treatment of executive functioning deficits and chronic fatigue syndrome. *Psychiatry Res*. 2013;207(1-2):127-33. [PMID 23062791](https://pubmed.ncbi.nlm.nih.gov/23062791/) | [NCT01071044](https://clinicaltrials.gov/study/NCT01071044) | Registry results |
| OTH-15 | Tramontana MG, et al. Traumatic brain injury-related attention deficits: treatment outcomes with lisdexamfetamine dimesylate (Vyvanse). *Brain Inj*. 2014;28(11):1461-72. [PMID 24988121](https://pubmed.ncbi.nlm.nih.gov/24988121/) | [NCT01000064](https://clinicaltrials.gov/study/NCT01000064) | Registry results |
| OTH-16 | Epperson CN, et al. New onset executive function difficulties at menopause: a possible role for lisdexamfetamine. *Psychopharmacology (Berl)*. 2015;232(16):3091-100. [PMID 26063677](https://pubmed.ncbi.nlm.nih.gov/26063677/), [PMC4631394](https://pmc.ncbi.nlm.nih.gov/articles/PMC4631394/) | [NCT01324024](https://clinicaltrials.gov/study/NCT01324024) | Registry results; abstract |
| OTH-17 | No separate publication found (fMRI substudy of OTH-16) | [NCT01977625](https://clinicaltrials.gov/study/NCT01977625) | Registry results |
| OTH-18 | Metcalf CA, et al. Treating new-onset cognitive complaints after risk-reducing salpingo-oophorectomy: a randomized controlled crossover trial of lisdexamfetamine. *Gynecol Oncol*. 2024;190:62-69. [PMID 39146756](https://pubmed.ncbi.nlm.nih.gov/39146756/), [PMC11702344](https://pmc.ncbi.nlm.nih.gov/articles/PMC11702344/) | [NCT03187353](https://clinicaltrials.gov/study/NCT03187353) | Registry results |
| OTH-19 | Haghighi M, et al. Influence of lisdexamfetamine dimesylate on early ejaculation: results from a double-blind randomized clinical trial. *Healthcare (Basel)*. 2021;9(7):859. [PMID 34356237](https://pubmed.ncbi.nlm.nih.gov/34356237/), [PMC8303163](https://pmc.ncbi.nlm.nih.gov/articles/PMC8303163/) | IRCT (number not verified) | Publication; no AE data |
| OTH-20 | No publication found (Yale University) | [NCT04599504](https://clinicaltrials.gov/study/NCT04599504) | Registry results |

## Screened and excluded

| Source | Reason |
|---|---|
| [NCT01863459](https://clinicaltrials.gov/study/NCT01863459); Van Ameringen M, et al. ACNP abstract, *Neuropsychopharmacology*. 2017;42:S342-S343 | No results accessible |
| [NCT02034201](https://clinicaltrials.gov/study/NCT02034201) | No results posted, no publication found |
| [NCT01131559](https://clinicaltrials.gov/study/NCT01131559), [NCT01051440](https://clinicaltrials.gov/study/NCT01051440) | Terminated; no results or 2 participants |
| [NCT01738698](https://clinicaltrials.gov/study/NCT01738698), [NCT01760889](https://clinicaltrials.gov/study/NCT01760889), [NCT01234298](https://clinicaltrials.gov/study/NCT01234298), [NCT01986777](https://clinicaltrials.gov/study/NCT01986777) | Withdrawn, or no participant randomized |
| [NCT05854667](https://clinicaltrials.gov/study/NCT05854667), [NCT06788587](https://clinicaltrials.gov/study/NCT06788587), [NCT06847399](https://clinicaltrials.gov/study/NCT06847399), [PMID 41309470](https://pubmed.ncbi.nlm.nih.gov/41309470/) | Ongoing |
| [NCT03924193](https://clinicaltrials.gov/study/NCT03924193), [NCT01816074](https://clinicaltrials.gov/study/NCT01816074) | No placebo arm |
| [NCT00573859](https://clinicaltrials.gov/study/NCT00573859) | Mixed ADHD drugs, not LDX only |
| [NCT01415440](https://clinicaltrials.gov/study/NCT01415440); [PMID 41256939](https://pubmed.ncbi.nlm.nih.gov/41256939/) | Children or adolescents |
| [NCT01096680](https://clinicaltrials.gov/study/NCT01096680); PMIDs [31765110](https://pubmed.ncbi.nlm.nih.gov/31765110/), [28936175](https://pubmed.ncbi.nlm.nih.gov/28936175/), [29511807](https://pubmed.ncbi.nlm.nih.gov/29511807/), [30381248](https://pubmed.ncbi.nlm.nih.gov/30381248/), [23431065](https://pubmed.ncbi.nlm.nih.gov/23431065/) | Healthy volunteers |
| PMIDs [19329547](https://pubmed.ncbi.nlm.nih.gov/19329547/), [18635707](https://pubmed.ncbi.nlm.nih.gov/18635707/) | Abuse-liability studies |
