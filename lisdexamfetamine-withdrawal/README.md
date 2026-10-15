# Lisdexamfetamine dimesylate: withdrawal effects

Search date: 2026-10-14. Data file: [`withdrawal_data.csv`](withdrawal_data.csv). Label text: [`LABEL_TEXT.md`](LABEL_TEXT.md). Sources: [`SOURCES.md`](SOURCES.md).

## Scope

- **Drug:** lisdexamfetamine dimesylate (LDX; Vyvanse, Elvanse; codes SPD489, NRP104).
- **Question:** what happens when a person stops LDX, or reduces the dose? Outcomes are withdrawal symptoms, rebound, adverse events after the stop, and neonatal withdrawal.
- **Sources:** regulatory labels (FDA, EMA/MHRA, TGA, Medsafe, Health Canada), the EU periodic safety review, randomized trials with a withdrawal phase, ClinicalTrials.gov results, systematic reviews, pharmacovigilance studies, a clinical guideline and case reports.
- **Not in scope:** commercial rehab and "taper community" web pages. Those pages appear high in the search results, but they are not primary sources.

## Method

1. A PubMed query for LDX + (withdrawal, discontinuation, rebound, cessation, dependence, taper, drug holiday, abrupt): 109 records, screened by title and abstract.
2. A query to the ClinicalTrials.gov API v2 for all LDX trials (127 records). A text filter found trials with a withdrawal measure, such as the Amphetamine Cessation Symptom Assessment (ACSA), or a randomized-withdrawal phase. The result tables came from the registry JSON.
3. The current labels from five regulators. Text came from the label PDFs. The 2015 and 2022 FDA labels show the earlier US wording.
4. Web searches for reviews, pharmacovigilance studies, guidelines, case reports and shortage studies.
5. Full text where it was open: PMC articles, the Coghill 2014 PDF (University of Dundee repository) and the label PDFs. Brams 2012 is paywalled, so only the abstract and the registry were used for it.

## Read these limits before you use the numbers

- **No trial had withdrawal symptoms as its primary outcome.** The ACSA was a secondary safety measure. No study was powered to find a difference, and most studies report no statistical test.
- **The ACSA was developed for methamphetamine withdrawal.** Its 16 items overlap with the symptoms of depression and of untreated BED or ADHD. It cannot separate withdrawal from the return of the disorder.
- **In randomized-withdrawal trials, the placebo arm is the "abrupt stop" arm.** Adverse events in that arm mix withdrawal, return of the disorder and background events. Relapse made the placebo exposure shorter (Brams 2012: median 13 vs 42 days), so the placebo arms had less time to report events.
- **Registry tables list a non-serious event only above a frequency threshold** (2 % or 5 %). An event that is not in a table is "not reported", not zero.
- **Every trial enrolled people who tolerated LDX** in an open-label phase. People with problems on LDX left before the withdrawal phase.
- **All trial data come from the manufacturer (Shire, now Takeda)** or authors with funding from it.
- **Doses are therapeutic** (20-70 mg/day), except in the methamphetamine trials (up to 250 mg/day). No controlled data exist for withdrawal after misuse of LDX.

## Main findings

1. **All five regulators say that withdrawal can occur. The US label now applies it to all prolonged use, not only high doses.** The FDA label of 04/2026 lists dysphoric mood, depression, fatigue, vivid unpleasant dreams, insomnia or hypersomnia, increased appetite, and psychomotor retardation or agitation. The 2015 and 2022 US labels said "extreme fatigue and depression" after "prolonged high-dosage administration". The Canadian, Australian and New Zealand labels still use the high-dose wording. They advise "careful supervision" or "gradual withdrawal". See [`LABEL_TEXT.md`](LABEL_TEXT.md).
2. **In controlled trials, an abrupt stop at therapeutic doses caused no clear withdrawal syndrome on the ACSA.** In BED (McElroy 2020), the mean ACSA total was 4.9 on the last LDX dose and 5.5 on day 7, on a 0-64 scale. The scores did not separate from placebo. Exposure was up to 38 weeks. The same result occurred in schizophrenia (Lasser 2013) and in remitted MDD (Madhoo 2014).
3. **A small, short rise in fatigue and craving scores occurred after the LDX stop.** In the BED trials, the LDX group's mean ACSA total rose above the day-0 value on days 1-7, with the peak on day 2. The fatigue and craving subscales rose on all 7 days. The authors call the changes small. The absolute values stayed low (peak mean 6.1 of 64 after 38 weeks of LDX).
4. **The main effect of a stop is the return of the disorder, and it comes fast.** ADHD relapse after a switch to placebo: 75 % of adults (Brams 2012) and 67.5 % of children (Coghill 2014). Most relapses occurred in the first 1-2 weeks. BED relapse: 32.1 % vs 3.7 % over 26 weeks (Hudson 2017), and 17.9 % vs 10.0 % over 12 weeks (Grilo 2024, not significant). Coghill 2014 says that some early "treatment failures" can be a withdrawal rebound.
5. **Adverse events in the abrupt-stop arms were not higher than in the continued-LDX arms.** Any TEAE, stop vs continued LDX: 25.3 % vs 39.7 % (children), 30.0 % vs 48.2 % (adults), 46.3 % vs 60.3 % (BED), 20.0 % vs 32.4 % (schizophrenia). A fifth trial (Grilo 2024, BED) has the same pattern. In BED, fatigue was more frequent after the stop: 5.2 % vs 2.9 %. The other withdrawal-type events had similar low rates in the two arms. One placebo-arm participant in Brams 2012 had serious suicidal ideation. The registry does not say when it occurred.
6. **Neonatal withdrawal is in the EU, US, Canadian, Australian and New Zealand labels.** The EU added it in 2019-2020 after the periodic safety review. The review included two case reports of neonatal withdrawal syndrome after LDX in pregnancy. The symptoms listed are feeding difficulties, irritability, agitation, excessive drowsiness, trembling and tight muscle tone.
7. **Pharmacovigilance data show a withdrawal signal for the amphetamine class.** FAERS 2004-2025: ROR 1.92 (95 % CI 1.78-2.08) for amphetamine, 1.71 for methylphenidate, and no signal for atomoxetine (Ebina 2026). The study does not say whether LDX reports are part of "amphetamine". No LDX-specific withdrawal signal was found.
8. **No study tested a taper schedule for LDX.** A 2026 review calls the lack of taper data for BED "a critical research gap" (Runfola 2026). The Australian ADHD guideline advises a review of continued treatment at least once a year.

## Table 1. ACSA scores before and after the LDX stop

ACSA: 16 items, each 0-4, total 0-64. A higher score means more withdrawal symptoms. Values are mean (SD).

| ID | Study | Population | LDX before the stop | Time point | LDX | Placebo |
|---|---|---|---|---|---|---|
| W-01 | McElroy 2020 (pooled SPD489-343/-344) | BED adults | 12 wk, 50-70 mg | Day 0 (last dose) | 4.9 (6.41), n=271 | 7.0 (7.60), n=275 |
| | | | | Day 7 after the last dose | 5.5 (7.50), n=221 | 4.8 (6.82), n=234 |
| W-02 | Hudson 2017 / McElroy 2020 (SPD489-346) | BED adults | up to 38 wk, 50-70 mg | Day 0 (last dose) | 4.7 (7.78), n=85 | 4.8 (6.67), n=44 † |
| | | | | Day 2 (LDX peak) | 6.1 (7.6), n=78 | — |
| | | | | Day 7 after the last dose | 5.2 (7.93), n=71 | 3.9 (5.75), n=37 † |
| W-03 | Lasser 2013 | Schizophrenia, adjunct | 10 wk, 20-70 mg | Change over the 4-wk withdrawal phase (registry) | +0.4 (7.65), n=29 (continued LDX) | −2.9 (8.75), n=29 (abrupt stop) |
| W-04 | Madhoo 2014 | Remitted MDD, adjunct | 9 wk, 20-70 mg | Baseline | 26.4 (11.04) | 25.5 (9.91) |
| | | | | Week 10 (1 wk after the stop) | 17.1 (11.85) | 19.5 (10.63) |
| | | | | Week 11 (2 wk after the stop) | 16.6 (11.66) | 19.7 (10.26) |

† In W-02, the placebo group stopped LDX at randomization, up to 26 weeks before this follow-up.

The CSV also has registry ACSA data for the two BED trials and the three MDD trials. The registry does not say whether those time points come after the last dose.

## Table 2. Adverse events in the randomized-withdrawal phase

In RW-01 to RW-04, the placebo arm received an abrupt switch from LDX to placebo. The Grilo 2024 abstract does not say if the switch was abrupt. Values are n/N (%).

| ID | Study | Phase length | Any TEAE: continued LDX | Any TEAE: abrupt stop | Serious AE: continued LDX | Serious AE: abrupt stop | Withdrawal-type events (LDX vs stop) |
|---|---|---|---|---|---|---|---|
| RW-01 | Coghill 2014, children 6-17 (NCT00784654) | 6 wk | 31/78 (39.7 %) | 20/79 (25.3 %) | 0/78 | 0/79 (paper); 1/79 "ADHD" (registry) | Fatigue 1 vs 0; depressed mood, anxiety, irritability 0 vs 0 |
| RW-02 | Brams 2012, adults (NCT00877487) | 6 wk | 27/56 (48.2 %) | 18/60 (30.0 %) | 0/56 | 1/60 (1.7 %), suicidal ideation | Insomnia 3 vs 3; headache 8 vs 3 |
| RW-03 | Hudson 2017, BED adults (NCT02009163) | 26 wk | 82/136 (60.3 %) | 62/134 (46.3 %) | 2/136 | 0/134 | Fatigue 4 vs 7; somnolence 5 vs 3; irritability 4 vs 4; anxiety 2 vs 2; insomnia 1 vs 2 |
| RW-04 | Lasser 2013, schizophrenia (NCT00922272) | 4 wk | 11/34 (32.4 %) | 7/35 (20.0 %) | 1/34 | 2/35 | Fatigue 2 vs 1; somnolence 0 vs 1 |
| RW-05 | Grilo 2024, BED with obesity (NCT03926052) | 12 wk | 13/32 (40.6 %) § | 6/29 (20.7 %) § | 0/32 | 0/29 | Insomnia 6 vs 4; no fatigue or mood term above the 5 % threshold |

"Any TEAE" values come from the publications, except §. § Registry count of participants with a non-serious event above the 5 % threshold. The withdrawal-type event counts come from the registry tables (threshold 2 % or 5 %) or the publication tables.

## Other evidence

- **Daily rebound (end-of-dose effect, not withdrawal).** In children 6-12, afternoon or evening ADHD rebound occurred in 3.4 % with LDX vs 9.7 % with placebo (López 2017). Rebounders on LDX had more emotional lability. An open-label study in 40 adults found "limited symptom rebound" (Adler 2017).
- **Case report.** An 11-year-old with autism and ADHD had migraine and marked malaise right after an LDX dose reduction. The same child had vomiting, headache and light sensitivity after an abrupt methylphenidate stop (Krakowski 2018). The authors suspect tolerance.
- **Youth discontinuation review.** Lohr 2021 (35 articles) found that withdrawal-type effects in youth come mainly from case reports. The randomized trials show relapse, not a withdrawal syndrome. The review suggests a gradual taper over weeks to months as a conservative approach.
- **Abuse and dependence reports.** In VigiBase, LDX had the same proportion of abuse-and-dependence reports as methylphenidate: ROR 1.06 (0.91-1.24); outside the US, 1.26 (1.03-1.54) (Jouanjus 2026). The other ADHD drugs had lower proportions.
- **Shortages.** An Australian dispensing study (Janetzki 2025) showed that patients changed to other LDX strengths during the 30 mg shortage. This search found no study of withdrawal effects caused by a shortage.
- **Animal data.** No animal study of LDX withdrawal was found. Rodent data for d-amphetamine (the active metabolite) show depressive-like behavior and reward deficits after chronic dosing stops. A rodent study (Yun 2017) shows that LDX causes conditioned place preference and self-administration.

## LDX as a treatment for methamphetamine withdrawal (separate topic)

Some search results are about LDX used to treat withdrawal from methamphetamine. These studies do not describe withdrawal from LDX, but they report what happens when high-dose LDX is tapered.

- **Acheson 2022:** open-label pilot, 10 inpatients. LDX 250 mg on day 1, reduced by 50 mg/day to 50 mg on day 5. No treatment-related serious AEs. Withdrawal severity and craving decreased during the admission.
- **Acheson 2025 protocol (ACTRN12624001061527):** double-blind RCT, 184 inpatients, same taper. The Amphetamine Withdrawal Questionnaire over 7 days is the primary outcome. Results are not published yet.
- **Ezard 2025 (LiMA):** 12 weeks of LDX 250 mg, then a 2-week taper (150 mg, then 50 mg). The trial measured withdrawal at week 19, but the publication text does not give the week-19 result. The trial was "not designed to test [...] tapering regimens".

## Gaps

- No randomized trial compares a taper with an abrupt stop.
- No withdrawal data exist after more than 38 weeks of LDX, or after doses above 70 mg/day in ADHD or BED.
- No withdrawal measure was used in the ADHD randomized-withdrawal trials (children or adults).
- No LDX-specific pharmacovigilance analysis of withdrawal reports was found.
- No controlled data exist for neonatal withdrawal after LDX. The evidence is two case reports and class data for amphetamine.
