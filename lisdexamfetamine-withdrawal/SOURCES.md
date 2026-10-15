# Sources

All sources were accessed on 2026-10-14.

## Databases and search queries

| Database | Query | Records |
|---|---|---|
| PubMed E-utilities (`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`) | `(lisdexamfetamine[tiab] OR lisdexamphetamine[tiab] OR vyvanse[tiab] OR elvanse[tiab] OR SPD489[tiab] OR NRP104[tiab]) AND (withdrawal[tiab] OR discontinu*[tiab] OR rebound[tiab] OR cessation[tiab] OR dependence[tiab] OR taper*[tiab] OR "drug holiday"[tiab] OR "physical dependence"[tiab] OR "abrupt"[tiab])` | 109 |
| ClinicalTrials.gov API v2 (`https://clinicaltrials.gov/api/v2/studies`) | `query.intr=lisdexamfetamine OR Vyvanse OR SPD489 OR NRP104 OR Elvanse`. Text filter on outcome measures: withdraw, cessation, ACSA, AWQ, discontinu, rebound, taper, dependence | 127 (15 with a match) |
| Web search | LDX withdrawal symptoms; ACSA and BED trials; current labels (FDA, EMA, TGA, Medsafe, Health Canada); FDA 2023 stimulant labeling; pharmacovigilance (FAERS, VigiBase); neonatal withdrawal; shortages; drug holidays; case reports; animal studies; LDX for methamphetamine withdrawal | — |

## Regulatory documents

| Document | Version | Link |
|---|---|---|
| Vyvanse prescribing information, FDA (NDA 021977/S052) | Revised 04/2026 | [Drugs@FDA PDF](https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/021977s052lbl.pdf); [DailyMed](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=704e4378-ca83-445c-8b45-3cfa51c1ecad) |
| Vyvanse prescribing information, FDA (NDA 021977/S048) | Revised 01/2022 | [Drugs@FDA PDF](https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/021977s048%2C208510s005lbl.pdf) |
| Vyvanse approval package, FDA (NDA 21-977/S036, BED approval) | Approved 1/30/2015 | [Drugs@FDA PDF](https://www.accessdata.fda.gov/drugsatfda_docs/nda/2015/021977Orig1s036.pdf) |
| FDA: "FDA requires updates to clarify labeling of prescription stimulants used to treat ADHD and other conditions" | 2023-05-11 | [fda.gov](https://www.fda.gov/drugs/drug-alerts-and-statements/fda-requires-updates-clarify-labeling-prescription-stimulants-used-treat-adhd-and-other-conditions) |
| Elvanse 50 mg hard capsules, SmPC (UK) | Revised 14/01/2026 | [emc](https://www.medicines.org.uk/emc/product/14101/smpc) |
| Lisdexamfetamine PSUSA/00010289/201902: CMDh scientific conclusions and grounds for variation (EMA) | CMDh position October 2019 | [EMA PDF](https://www.ema.europa.eu/documents/psusa/lisdexamfetamine-cmdh-scientific-conclusions-grounds-variation-amendments-product-information/00010289/201902_bg.pdf) |
| Vyvanse Australian Product Information (TGA), PI V12.0 | Revised 01 April 2026 | [medsinfo PDF](https://medsinfo.com.au/api/documents/Vyvanse_PI?format=pdf) |
| Vyvanse New Zealand data sheet (Medsafe) | Revised 07 September 2026 | [Medsafe PDF](https://www.medsafe.govt.nz/Profs/DataSheet/v/vyvansecap.pdf) |
| Vyvanse Product Monograph (Health Canada, Takeda Canada) | Revised 20 March 2024 | [pdf.hres.ca](https://pdf.hres.ca/dpd_pm/00075011.PDF) |

## Studies with withdrawal data (ACSA or randomized withdrawal)

"Data source" names the source of the numbers in `withdrawal_data.csv`.

| ID | Publication | Registry | Data source |
|---|---|---|---|
| W-01, W-02 | McElroy SL, Robertson B, Wu J, Fant RV, Schnoll SH. Assessment of amphetamine withdrawal symptoms of lisdexamfetamine dimesylate treatment for adults with binge-eating disorder. *Prim Care Companion CNS Disord*. 2020;22(2):19m02540. doi:10.4088/PCC.19m02540. [PMID 32237290](https://pubmed.ncbi.nlm.nih.gov/32237290/). Full text: [psychiatrist.com](https://www.psychiatrist.com/pcc/amphetamine-withdrawal-after-lisdexamfetamine-cessation/) | [NCT01718483](https://clinicaltrials.gov/study/NCT01718483), [NCT01718509](https://clinicaltrials.gov/study/NCT01718509), [NCT02009163](https://clinicaltrials.gov/study/NCT02009163) | Publication; registry results |
| W-01a, W-01b | McElroy SL, et al. Lisdexamfetamine dimesylate for adults with moderate to severe binge eating disorder: results of two pivotal phase 3 randomized controlled trials. *Neuropsychopharmacology*. 2016;41(5):1251-60. [PMID 26346638](https://pubmed.ncbi.nlm.nih.gov/26346638/) | NCT01718483, NCT01718509 | Registry results |
| W-02, RW-03 | Hudson JI, et al. Efficacy of lisdexamfetamine in adults with moderate to severe binge-eating disorder: a randomized clinical trial. *JAMA Psychiatry*. 2017;74(9):903-910. [PMID 28700805](https://pubmed.ncbi.nlm.nih.gov/28700805/), [PMC5710231](https://pmc.ncbi.nlm.nih.gov/articles/PMC5710231/) | NCT02009163 | Publication (Table 2, ACSA text); registry results |
| W-03, RW-04 | Lasser RA, et al. Adjunctive lisdexamfetamine dimesylate therapy in adult outpatients with predominant negative symptoms of schizophrenia: open-label and randomized-withdrawal phases. *Neuropsychopharmacology*. 2013;38(11):2140-9. [PMID 23756608](https://pubmed.ncbi.nlm.nih.gov/23756608/), [PMC3773663](https://pmc.ncbi.nlm.nih.gov/articles/PMC3773663/) | [NCT00922272](https://clinicaltrials.gov/study/NCT00922272) | Publication; registry results |
| W-04 | Madhoo M, et al. Lisdexamfetamine dimesylate augmentation in adults with persistent executive dysfunction after partial or full remission of major depressive disorder. *Neuropsychopharmacology*. 2014;39(6):1388-98. [PMID 24309905](https://pubmed.ncbi.nlm.nih.gov/24309905/), [PMC3988542](https://pmc.ncbi.nlm.nih.gov/articles/PMC3988542/) | [NCT00985725](https://clinicaltrials.gov/study/NCT00985725) | Publication; registry results |
| W-05, W-06 | Richards C, et al. Lisdexamfetamine dimesylate augmentation for adults with major depressive disorder and inadequate response to antidepressant monotherapy: results from 2 phase 3 studies. *J Affect Disord*. 2016;206:151-160. [PMID 27474961](https://pubmed.ncbi.nlm.nih.gov/27474961/) | [NCT01436149](https://clinicaltrials.gov/study/NCT01436149), [NCT01436162](https://clinicaltrials.gov/study/NCT01436162) | Registry results only |
| W-07 | No publication found (open-label MDD extension, terminated) | [NCT01436175](https://clinicaltrials.gov/study/NCT01436175) | Registry results only |
| RW-01 | Coghill DR, et al. Maintenance of efficacy of lisdexamfetamine dimesylate in children and adolescents with attention-deficit/hyperactivity disorder: randomized-withdrawal study design. *J Am Acad Child Adolesc Psychiatry*. 2014;53(6):647-657.e1. [PMID 24839883](https://pubmed.ncbi.nlm.nih.gov/24839883/). Full text: [University of Dundee repository PDF](https://discovery.dundee.ac.uk/ws/files/8858120/1_s2.0_S0890856714001580_main.pdf) | [NCT00784654](https://clinicaltrials.gov/study/NCT00784654) | Publication (Table 2, Discussion); registry results |
| RW-01 (companion) | Banaschewski T, et al. Health-related quality of life and functional outcomes from a randomized-withdrawal study of long-term lisdexamfetamine dimesylate treatment in children and adolescents with ADHD. *CNS Drugs*. 2014;28(12):1191-203. [PMID 25139785](https://pubmed.ncbi.nlm.nih.gov/25139785/), [PMC4246127](https://pmc.ncbi.nlm.nih.gov/articles/PMC4246127/) | NCT00784654 | Abstract (no withdrawal data) |
| RW-02 | Brams M, et al. Maintenance of efficacy of lisdexamfetamine dimesylate in adults with attention-deficit/hyperactivity disorder: randomized withdrawal design. *J Clin Psychiatry*. 2012;73(7):977-83. [PMID 22780921](https://pubmed.ncbi.nlm.nih.gov/22780921/) | [NCT00877487](https://clinicaltrials.gov/study/NCT00877487) | Abstract; registry results (full text paywalled) |
| RW-05 | Grilo CM, et al. Lisdexamfetamine maintenance treatment for binge-eating disorder following successful treatments: randomized double-blind placebo-controlled trial. *Psychol Med*. 2024;54(12):3334-3344. [PMID 39258475](https://pubmed.ncbi.nlm.nih.gov/39258475/), [PMC11496227](https://pmc.ncbi.nlm.nih.gov/articles/PMC11496227/) | [NCT03926052](https://clinicaltrials.gov/study/NCT03926052) | Abstract; registry results |
| RB-01 | López FA, et al. ADHD symptom rebound and emotional lability with lisdexamfetamine dimesylate in children aged 6 to 12 years. *J Atten Disord*. 2017;21(1):52-61. [PMID 23407278](https://pubmed.ncbi.nlm.nih.gov/23407278/) | — | Abstract |

## Pharmacovigilance

| ID | Publication | Data source |
|---|---|---|
| PV-01 | Ebina T, Iwamoto K, Ikeda M. ADHD medications and drug withdrawal: a pharmacovigilance study using the FDA Adverse Event Reporting System (FAERS) database. *PCN Rep*. 2026;5(2):e70337. doi:10.1002/pcn5.70337. [PMID 42021984](https://pubmed.ncbi.nlm.nih.gov/42021984/), [PMC13096721](https://pmc.ncbi.nlm.nih.gov/articles/PMC13096721/) | Publication (Table 1) |
| PV-02 | Jouanjus E, et al. Comparative potential for generating spontaneous signals for abuse and dependence among drugs used for attention deficit hyperactivity disorder: a disproportionality analysis in VigiBase. *Gen Psychiatr*. 2026;39(4):e70046. doi:10.1002/gps3.70046. [PMID 42602008](https://pubmed.ncbi.nlm.nih.gov/42602008/), [PMC13473179](https://pmc.ncbi.nlm.nih.gov/articles/PMC13473179/) | Abstract |

## Reviews, guidelines and other studies

| Publication | Use in README |
|---|---|
| Lohr WD, et al. Intentional discontinuation of psychostimulants used to treat ADHD in youth: a review and analysis. *Front Psychiatry*. 2021;12:642798. doi:10.3389/fpsyt.2021.642798. [Full text](https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2021.642798/full) | Youth discontinuation review |
| Buitelaar J, et al. Differences in maintenance of response upon discontinuation across medication treatments in ADHD. *Eur Neuropsychopharmacol*. 2015;25(10):1611-21. [PMID 26169574](https://pubmed.ncbi.nlm.nih.gov/26169574/) | Background: relapse after stimulant stop is faster than after atomoxetine |
| Runfola CD, Safer DL. Psychotherapy-supported lisdexamfetamine tapering in binge-eating disorder: spotlighting a critical research gap. *Int J Eat Disord*. 2026;59(6):1246-1256. doi:10.1002/eat.70071. [PMID 41760290](https://pubmed.ncbi.nlm.nih.gov/41760290/) | Taper research gap |
| Australasian ADHD Professionals Association. Australian ADHD Clinical Practice Guideline, section "Medication review and discontinuation". [adhdguideline.aadpa.com.au](https://adhdguideline.aadpa.com.au/pharmacological/discontinue-adhd-medication/) | Annual review; LDX withdrawal evidence rated very low to moderate quality |
| Krakowski A, Ickowicz A. Stimulant withdrawal in a child with autism spectrum disorder and ADHD: a case report. *J Can Acad Child Adolesc Psychiatry*. 2018;27(2):148-151. [PMID 29662527](https://pubmed.ncbi.nlm.nih.gov/29662527/), [PMC5896529](https://pmc.ncbi.nlm.nih.gov/articles/PMC5896529/) | Case report |
| Adler LA, et al. Effectiveness and duration of effect of open-label lisdexamfetamine dimesylate in adults with ADHD. *J Atten Disord*. 2017;21(2):149-157. [PMID 23657761](https://pubmed.ncbi.nlm.nih.gov/23657761/); [NCT01070394](https://clinicaltrials.gov/study/NCT01070394) | Daily rebound in adults |
| Janetzki J, Kalisch L, Hall K, Pratt N. Utilisation trends of lisdexamfetamine: insights from recent medicine shortages in Australia. *Pharmacoepidemiol Drug Saf*. 2025;34(2):e70113. doi:10.1002/pds.70113. [PMID 39930973](https://pubmed.ncbi.nlm.nih.gov/39930973/), [PMC11811742](https://pmc.ncbi.nlm.nih.gov/articles/PMC11811742/) | Shortage study |
| Yun J, et al. Potential for dependence on lisdexamfetamine: in vivo and in vitro aspects. *Biomol Ther (Seoul)*. 2017;25(6):659-664. [PMID 28190317](https://pubmed.ncbi.nlm.nih.gov/28190317/), [PMC5685436](https://pmc.ncbi.nlm.nih.gov/articles/PMC5685436/) | Animal data |

## LDX as a treatment for methamphetamine withdrawal

| Publication | Registry |
|---|---|
| Acheson LS, et al. Lisdexamfetamine for the treatment of acute methamphetamine withdrawal: a pilot feasibility and safety trial. *Drug Alcohol Depend*. 2022;241:109692. [PMID 36399936](https://pubmed.ncbi.nlm.nih.gov/36399936/) | — |
| Acheson LS, et al. Study protocol for a randomised controlled trial to determine the efficacy of lisdexamfetamine for the treatment of acute methamphetamine withdrawal in inpatient settings. *BMJ Open*. 2025;15(11):e107242. [PMID 41309470](https://pubmed.ncbi.nlm.nih.gov/41309470/), [PMC12684119](https://pmc.ncbi.nlm.nih.gov/articles/PMC12684119/) | ACTRN12624001061527 |
| Ezard N, et al. Lisdexamfetamine in the treatment of methamphetamine dependence: a randomised, placebo-controlled trial. *Addiction*. 2025;120(7):1345-1359. [PMID 39701142](https://pubmed.ncbi.nlm.nih.gov/39701142/), [PMC12128569](https://pmc.ncbi.nlm.nih.gov/articles/PMC12128569/) | ACTRN12617000657325 |

## Screened and not used

| Source | Reason |
|---|---|
| Gasior M, et al. 12-month BED extension. *J Clin Psychopharmacol*. 2017 ([PMID 28383364](https://pubmed.ncbi.nlm.nih.gov/28383364/), [NCT01657019](https://clinicaltrials.gov/study/NCT01657019)) | No withdrawal measure after the stop |
| [NCT01760993](https://clinicaltrials.gov/study/NCT01760993), [NCT01738698](https://clinicaltrials.gov/study/NCT01738698), [NCT01760889](https://clinicaltrials.gov/study/NCT01760889) | ACSA planned, but terminated with no participant randomized |
| [NCT01328756](https://clinicaltrials.gov/study/NCT01328756) (2-year pediatric safety study) | No withdrawal measure |
| Commercial pages (floridarehab.com, taper.community, recovered.org, choosingtherapy.com, healthrx.com, singlecare.com) | Not primary sources |
| Frontiers in Pharmacology 2024 FAERS withdrawal study ([PMC11266151](https://pmc.ncbi.nlm.nih.gov/articles/PMC11266151/)); medRxiv 2026 FAERS/EudraVigilance preprints | No LDX-specific result; preprints are not peer reviewed |
| Rodent amphetamine-withdrawal studies (d-amphetamine, methamphetamine) | Not LDX; used only as background in the README |
