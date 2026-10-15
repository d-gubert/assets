# Lisdexamfetamine dimesylate: adverse events in placebo-controlled RCTs in adults

Search date: 2026-10-14. Data file: [`adverse_events.csv`](adverse_events.csv).

## Scope

- **Drug:** lisdexamfetamine dimesylate (LDX; Vyvanse, Elvanse; codes SPD489, NRP104).
- **Design:** randomized trials with a placebo arm or a placebo period. Parallel-group, crossover and randomized-withdrawal designs are included. For randomized-withdrawal trials, only the double-blind phase counts.
- **Population:** adults. Three groups: adult ADHD, binge-eating disorder (BED), and other indications. Trials that enrolled from age 16 are included and marked.
- **Outcome:** adverse events (AEs) of any kind, serious AEs, discontinuation for AEs, and vital-sign changes where the source reports them.

## Method

1. A query to the ClinicalTrials.gov API v2 for all interventional LDX trials (119 records). The query used the terms lisdexamfetamine, Vyvanse, Elvanse, SPD489 and NRP104.
2. A query to PubMed for LDX + placebo + randomized (155 records).
3. Web searches for trials that are not in the two databases (Australian and Iranian registries).
4. Manual screen of each record against the scope.
5. Data extraction from two source types:
   - The ClinicalTrials.gov results module (AE tables and participant flow). Extraction is automatic, from the registry JSON.
   - The publication (abstract or full text), where the registry has no results or no placebo-arm AE data.

The CSV has one row per trial × arm × event. The `source` column names the source of each row.

**Read these limits before you use the numbers:**

- Registry AE tables list a non-serious event only if it is above a frequency threshold (0–5 %, per trial). The `source` column gives the threshold. An event that is not in a table is "not reported" (nr). It is not zero.
- A cell with † is the registry count of participants with ≥ 1 non-serious AE above the threshold. It is not the total AE rate.
- Crossover trials report each period. The same participants are in the LDX and placebo rows.
- The trials collected AEs in different ways: spontaneous report, checklist, or a side-effect rating scale. Do not compare absolute rates across trials.
- This is a collection of results. It contains no meta-analysis and no risk-of-bias assessment.

## Main findings

1. **The common AEs are the same in all indications:** dry mouth, decreased appetite, insomnia and headache. Nausea, anxiety, a jittery feeling, irritability, increased heart rate and hyperhidrosis also occur more often with LDX than with placebo.
2. **Any-AE rates are higher with LDX in short-term parallel trials.** Adult ADHD: 79 % vs 58 % (Adler 2008). BED: 85 % vs 59 % (McElroy 2015). MDD adjunct: 60 % vs 49 % (Trivedi 2013). Methamphetamine dependence at 250 mg/day: 75 % vs 73 % (Ezard 2025).
3. **In the large ADHD and BED trials, dry mouth occurs in 26–40 % with LDX vs 3–9 % with placebo.** Decreased appetite occurs in 27–33 % (ADHD) and 6–21 % (BED) vs 2–6 % with placebo. Insomnia occurs in 11–19 % vs 2–8 %.
4. **Serious AEs are rare, and the rates are similar in the two arms.** Examples: BED phase 3, 0.6–1.6 % vs 1.1 %. MDD phase 3, 0.5–1.5 % vs 0.5–2.5 %.
5. **In most trials, more participants stop LDX than placebo because of AEs.** The range is 0–8 % with LDX vs 0–5 % with placebo. In Adler 2008, the causes in more than one participant were insomnia, raised blood pressure, tachycardia, dyspnoea, irritability, headache and anxiety.
6. **LDX increases pulse a small amount, and the increase is dose-related.** Blood pressure increases less. LDX decreases body weight (see "Vital signs and weight").
7. **AE rates are lower in randomized-withdrawal trials** (Brams 2012: 48 % vs 30 %; Hudson 2017). These trials enrolled people who tolerated LDX in an open-label phase.

## Table 1. Trial list and summary safety outcomes

"LDX arm used" names the arm in the comparison. For multi-dose parallel trials, "computed" means the sum of the fixed-dose arms. The study IDs link to the rows in the CSV.

| ID | Study | Registry | LDX arm used | Any AE: LDX | Any AE: placebo | Serious AE: LDX | Serious AE: placebo | Stopped for AE: LDX | Stopped for AE: placebo |
|---|---|---|---|---|---|---|---|---|---|
| ADHD-01 | Adler 2008 (NRP104.303) | NCT00334880 | LDX all doses (computed) | 282/358 (78.8%) | 36/62 (58.1%) | 2/358 (0.6%) | 0/62 (0.0%) | 21/358 (5.9%) | 1/62 (1.6%) |
| ADHD-02 | Wigal 2010 (SPD489-316) | NCT00697515 | LDX | 32/115 (27.8%) | 42/117 (35.9%) | 0/115 (0.0%) | 0/117 (0.0%) | nr | nr |
| ADHD-03 | Brams 2012 (SPD489-401) | NCT00877487 | LDX | 27/56 (48.2%) | 18/60 (30.0%) | 0/56 (0.0%) | 1/60 (1.7%) | 0/56 (0.0%) | 1/60 (1.7%) |
| ADHD-04 | Adler 2013 (SPD489-403) | NCT01101022 | LDX | 62/79 (78.5%) † | 41/80 (51.2%) † | 0/79 (0.0%) | 0/80 (0.0%) | 6/79 (7.6%) | 2/80 (2.5%) |
| ADHD-05 | Martin 2014 | NCT01010750 | LDX 50 mg | 12/18 (66.7%) † | 8/17 (47.1%) † | 0/18 (0.0%) | 0/17 (0.0%) | nr | nr |
| ADHD-06 | Biederman 2012 | NCT00801229 | LDX | 30/35 (85.7%) † | 20/34 (58.8%) † | 0/35 (0.0%) | 0/34 (0.0%) | 1/35 (2.9%) | 1/34 (2.9%) |
| ADHD-07 | DuPaul 2012 | NCT01342445 | LDX 70 mg | 0/24 (0.0%) † | 0/24 (0.0%) † | 0/24 (0.0%) | 0/24 (0.0%) | nr | nr |
| ADHD-08 | Kollins 2014 | NCT00736255 | LDX | 15/17 (88.2%) † | 12/15 (80.0%) † | 0/17 (0.0%) | 0/15 (0.0%) | 1/17 (5.9%) | 0/15 (0.0%) |
| ADHD-09 | Waxmonsky 2014 | NCT01127607 | LDX | 5/13 (38.5%) † | 5/13 (38.5%) † | 0/13 (0.0%) | 0/13 (0.0%) | nr | nr |
| ADHD-10 | Gordon 2021 | NCT03446885 | LDX 40 mg | 0/20 (0.0%) † | 0/20 (0.0%) † | 0/20 (0.0%) | 0/20 (0.0%) | nr | nr |
| ADHD-11 | Adler 2021 | NCT02635035 | LDX | nr | nr | 0/38 (0.0%) | 0/38 (0.0%) | 0/38 (0.0%) | 1/38 (2.6%) |
| BED-01 | McElroy 2015 (SPD489-208) | NCT01291173 | LDX all doses (computed) | 166/196 (84.7%) | 37/63 (58.7%) | 3/196 (1.5%) | 0/63 (0.0%) | 7/196 (3.6%) | 0/63 (0.0%) |
| BED-02 | McElroy 2016, study 1 (SPD489-343) | NCT01718483 | LDX | 125/192 (65.1%) † | 67/187 (35.8%) † | 3/192 (1.6%) | 2/187 (1.1%) | 12/192 (6.2%) | 5/187 (2.7%) |
| BED-03 | McElroy 2016, study 2 (SPD489-344) | NCT01718509 | LDX | 100/181 (55.2%) † | 43/185 (23.2%) † | 1/181 (0.6%) | 2/185 (1.1%) | 7/181 (3.9%) | 5/185 (2.7%) |
| BED-04 | Hudson 2017 (SPD489-346) | NCT02009163 | LDX | 59/136 (43.4%) † | 45/134 (33.6%) † | 2/136 (1.5%) | 0/134 (0.0%) | 6/136 (4.4%) | 0/134 (0.0%) |
| BED-05 | Guerdjikova 2016 | NCT01090713 | LDX | nr | nr | 1/25 (4.0%) | nr | nr | nr |
| BED-06 | Grilo 2024 | NCT03926052 | LDX | 13/32 (40.6%) † | 6/29 (20.7%) † | 0/32 (0.0%) | 0/29 (0.0%) | nr | nr |
| BED-07 | Schneider 2022 | NCT04181957 | LDX 50 mg | nr | nr | nr | nr | 1/23 (4.3%) | nr |
| OTH-01 | Trivedi 2013 (SPD489-206) | NCT00905424 | LDX | 53/88 (60.2%) | 42/85 (49.4%) | 0/88 (0.0%) | 1/85 (1.2%) | 4/88 (4.5%) | 2/85 (2.4%) |
| OTH-02 | Madhoo 2014 | NCT00985725 | LDX | 78.9% | 73.6% | 2/71 (2.8%) | 4/72 (5.6%) | 4/71 (5.6%) | 1/72 (1.4%) |
| OTH-03 | Richards 2016, study 1 (SPD489-322) | NCT01436149 | LDX | 70/201 (34.8%) † | 54/201 (26.9%) † | 3/201 (1.5%) | 5/201 (2.5%) | 11/201 (5.5%) | 10/201 (5.0%) |
| OTH-04 | Richards 2016, study 2 (SPD489-323) | NCT01436162 | LDX | 72/211 (34.1%) † | 46/213 (21.6%) † | 1/211 (0.5%) | 1/213 (0.5%) | 5/211 (2.4%) | 6/213 (2.8%) |
| OTH-05 | Richards 2017 (SPD489-321) | NCT01435759 | LDX all doses (computed) | 139/311 (44.7%) † | 20/78 (25.6%) † | 1/311 (0.3%) | 0/78 (0.0%) | 6/311 (1.9%) | 0/78 (0.0%) |
| OTH-06 | McLean Hospital trial (unpublished) | NCT01148979 | LDX | 23/28 (82.1%) † | 18/28 (64.3%) † | 0/28 (0.0%) | 0/28 (0.0%) | nr | nr |
| OTH-07 | McElroy 2015 (bipolar) | NCT01093963 | LDX | nr | nr | 0/11 (0.0%) | nr | nr | nr |
| OTH-08 | Lasser 2013 | NCT00922272 | LDX | 11/34 (32.4%) † | 7/35 (20.0%) † | 1/34 (2.9%) | 2/35 (5.7%) | 1/34 (2.9%) | 1/35 (2.9%) |
| OTH-09 | Martin 2014 (schizophrenia) | NCT01457339 | LDX all doses | 23/24 (95.8%) | 4/7 (57.1%) | 0/24 (0.0%) | 0/7 (0.0%) | nr | nr |
| OTH-10 | Mooney 2015 | NCT00958282 | LDX 70 mg | nr | nr | 1/22 (4.5%) | 1/21 (4.8%) | nr | nr |
| OTH-11 | Ezard 2025 (LiMA) | ACTRN12617000657325 | LDX 250 mg | 56/75 (74.7%) | 58/80 (72.5%) | 4/75 (5.3%) | 3/80 (3.8%) | nr | nr |
| OTH-12 | Morrow 2013 | NCT01615887 | LDX | 73.5% | 68.4% | 0/41 (0.0%) | 0/22 (0.0%) | nr | nr |
| OTH-13 | Tavajohi 2025 | IRCT (number not verified) | LDX | nr | nr | nr | nr | nr | nr |
| OTH-14 | Young 2013 | NCT01071044 | LDX | 8/15 (53.3%) † | 7/11 (63.6%) † | 0/15 (0.0%) | 0/11 (0.0%) | nr | nr |
| OTH-15 | Tramontana 2014 | NCT01000064 | LDX | 0/11 (0.0%) † | 0/11 (0.0%) † | 0/11 (0.0%) | 0/11 (0.0%) | nr | nr |
| OTH-16 | Epperson 2015 | NCT01324024 | LDX | 6/32 (18.8%) † | 1/32 (3.1%) † | 0/32 (0.0%) | 0/32 (0.0%) | nr | nr |
| OTH-17 | Epperson fMRI substudy | NCT01977625 | LDX | 1/15 (6.7%) † | 1/15 (6.7%) † | 0/15 (0.0%) | 0/15 (0.0%) | nr | nr |
| OTH-18 | Metcalf 2024 | NCT03187353 | LDX 60 mg | 12/43 (27.9%) † | 4/58 (6.9%) † | 0/43 (0.0%) | 0/58 (0.0%) | nr | nr |
| OTH-19 | Haghighi 2021 | IRCT (number not verified) | LDX | nr | nr | nr | nr | nr | nr |
| OTH-20 | Yale bariatric trial (unpublished) | NCT04599504 | LDX | 8/9 (88.9%) † | 3/7 (42.9%) † | 0/9 (0.0%) | 0/7 (0.0%) | nr | nr |

nr = not reported. † = registry count of participants with ≥ 1 non-serious AE above the registry threshold.

**Design and population of each trial**

| ID | Population | Design |
|---|---|---|
| ADHD-01 | ADHD, adults 18-55 | Parallel, forced-dose 30/50/70 mg vs placebo, 4 wk |
| ADHD-02 | ADHD, adults 18-55 | 4-wk open-label dose optimization, then 2-wk double-blind crossover (1 wk LDX 30-70 mg / 1 wk placebo) |
| ADHD-03 | ADHD, adults 18-55 on LDX >=6 months | 3-wk open-label LDX, then 6-wk double-blind randomized withdrawal (LDX 30-70 mg vs placebo) |
| ADHD-04 | ADHD with executive-function impairment, adults 18-55 | Parallel, dose-optimized 30-70 mg vs placebo, 10 wk |
| ADHD-05 | ADHD, adults 18-55 | 3-period crossover: LDX 50 mg / MAS-IR 20 mg / placebo, 7 days each |
| ADHD-06 | ADHD, young adults (registry 18-24 y; paper 18-26 y) | Parallel, LDX vs placebo, 6 wk (driving simulator) |
| ADHD-07 | ADHD, college students 18-28 | Crossover: 1 wk each of placebo, LDX 30, 50, 70 mg |
| ADHD-08 | ADHD + nicotine dependence, adults 18-50 | Parallel, LDX up to 70 mg vs placebo, both with nicotine patch, quit attempt |
| ADHD-09 | Parents with ADHD (children with ADHD), adults 18-55 | 3-wk open-label LDX titration, then randomized LDX 30-70 mg vs placebo (~1 month; registry: mean 8 wk) |
| ADHD-10 | ADHD, adolescents and young adults 16-25 | Crossover, single dose LDX 40 mg vs placebo (simulated workplace) |
| ADHD-11 | ADHD + sluggish cognitive tempo, adults 18-60 | Crossover, LDX 30-70 mg vs placebo, 4 wk each, 2-wk washout |
| BED-01 | Moderate-severe BED, adults 18-55 | Parallel, forced-dose 30/50/70 mg vs placebo, 11 wk |
| BED-02 | Moderate-severe BED, adults 18-55 | Parallel, dose-optimized 50/70 mg vs placebo, 12 wk |
| BED-03 | Moderate-severe BED, adults 18-55 | Parallel, dose-optimized 50/70 mg vs placebo, 12 wk |
| BED-04 | Moderate-severe BED, adults 18-55, LDX responders | 12-wk open-label LDX 50/70 mg, then 26-wk double-blind randomized withdrawal |
| BED-05 | BED, adults 18-55 | Parallel, flexible LDX 20-70 mg vs placebo, 12 wk |
| BED-06 | BED with obesity, acute responders, adults 18-64 | Parallel maintenance, LDX vs placebo, 12 wk |
| BED-07 | Women with binge-eating symptoms, 18-55 | Crossover, single dose LDX 50 mg vs placebo |
| OTH-01 | MDD with residual symptoms on escitalopram, adults 18-55 | Parallel, adjunctive LDX 20-50 mg vs placebo, 6 wk |
| OTH-02 | Remitted MDD with executive dysfunction, adults 18-55 | Parallel, adjunctive LDX 20-70 mg vs placebo, 9 wk |
| OTH-03 | MDD, inadequate antidepressant response, adults 18-65 | Parallel, adjunctive LDX 20-70 mg vs placebo, 8 wk |
| OTH-04 | MDD, inadequate antidepressant response, adults 18-65 | Parallel, adjunctive LDX 20-70 mg vs placebo, 8 wk |
| OTH-05 | MDD, inadequate antidepressant response, adults 18-65 | Parallel, adjunctive fixed LDX 10/30/50/70 mg vs placebo, 8 wk |
| OTH-06 | MDD, partial response to SSRI/SNRI, adults 18-65 | Crossover, adjunctive LDX 20-50 mg vs placebo, 4 wk each, 2-wk washout |
| OTH-07 | Bipolar I/II depression on mood stabilizer, adults 18-55 | Parallel, adjunctive LDX vs placebo, 8 wk (terminated early) |
| OTH-08 | Stable schizophrenia, predominant negative symptoms, adults 18-55 | 10-wk open-label adjunctive LDX 20-70 mg, then 4-wk double-blind randomized withdrawal |
| OTH-09 | Stable schizophrenia on antipsychotics, adults 18-65 | Parallel, ascending LDX 50-250 mg (5 days per dose) vs placebo |
| OTH-10 | Cocaine dependence, adults 18-65 | Parallel, LDX 70 mg vs placebo, 14 wk |
| OTH-11 | Methamphetamine dependence, adults | Parallel, LDX 250 mg vs placebo, 1-wk induction + 12-wk maintenance + 2-wk taper |
| OTH-12 | MS with cognitive impairment, adults 18-55 | Parallel 2:1, LDX 30-70 mg vs placebo, 8 wk |
| OTH-13 | MS with fatigue | Parallel, LDX 30 then 50 mg vs placebo, 8 wk |
| OTH-14 | CFS with executive dysfunction, adults 18-60 | Parallel, flexible LDX 30-70 mg vs placebo, 6 wk |
| OTH-15 | TBI-related attention deficits, 16-42 y | Crossover, LDX vs placebo, 12 wk total |
| OTH-16 | Peri/postmenopausal women with new-onset executive-function complaints, 45-60 | Crossover, LDX 40-60 mg vs placebo, 4 wk each |
| OTH-17 | Menopausal women with cognitive complaints, 45-60 | Crossover, LDX vs placebo (fMRI) |
| OTH-18 | Women after risk-reducing salpingo-oophorectomy, 35-58 | Crossover, LDX 20-60 mg vs placebo, 6 wk each, 2-wk washout |
| OTH-19 | Men with early ejaculation, mean age 35 | Parallel, LDX 30 mg on demand vs placebo, 4 wk |
| OTH-20 | Non-responders to acute treatment, adults 18-64 | Parallel, LDX vs placebo, 12 wk |

## Table 2. Common AEs: LDX % / placebo %

Only trials with one or more of these events in an AE table are listed. "Jittery" includes the terms "feeling jittery", "tense/jittery", "anxious/jittery", "jitters" and "anxiety/jitteriness".

| ID | Study | Dry mouth | Decreased appetite | Insomnia | Headache | Nausea | Anxiety | Jittery | Irritability |
|---|---|---|---|---|---|---|---|---|---|
| ADHD-01 | Adler 2008 (NRP104.303) | 25.7 / 3.2 | 26.5 / 1.6 | 19.3 / 4.8 | nr | 7 / 0 | 5.9 / 0 | 4.2 / 0 | nr |
| ADHD-02 | Wigal 2010 (SPD489-316) | 3.5 / 0.9 | 3.5 / 1.7 | 2.6 / 1.7 | 1.7 / 2.6 | 1.7 / 0 | 1.7 / 0 | 0 / 0 | 0 / 0.9 |
| ADHD-03 | Brams 2012 (SPD489-401) | nr | nr | 5.4 / 5 | 14.3 / 5 | nr | nr | nr | nr |
| ADHD-04 | Adler 2013 (SPD489-403) | 31.6 / 7.5 | 32.9 / 6.2 | 12.7 / 3.8 | 25.3 / 2.5 | 2.5 / 6.2 | nr | 12.7 / 0 | 10.1 / 3.8 |
| ADHD-05 | Martin 2014 | 33.3 / 17.6 | 16.7 / 5.9 | 5.6 / 0 | 5.6 / 17.6 | 5.6 / 0 | nr | 5.6 / 0 | 5.6 / 0 |
| ADHD-06 | Biederman 2012 | nr | 54.3 / 5.9 | 20 / 2.9 | 14.3 / 2.9 | nr | nr | 22.9 / 5.9 | nr |
| ADHD-08 | Kollins 2014 | 11.8 / 0 | 35.3 / 6.7 | 5.9 / 13.3 | 23.5 / 13.3 | 23.5 / 40 | 5.9 / 13.3 | nr | 17.6 / 6.7 |
| ADHD-09 | Waxmonsky 2014 | 23.1 / 7.7 | 23.1 / 15.4 | 23.1 / 30.8 | 7.7 / 0 | nr | nr | 23.1 / 23.1 | 23.1 / 7.7 |
| ADHD-11 | Adler 2021 | 7.56 / 0.84 | 10.92 / 0 | 10.08 / 3.36 | 10.08 / 7.56 | nr | nr | 4.2 / 2.52 | nr |
| BED-01 | McElroy 2015 (SPD489-208) | 36.2 / 7.9 | 21.4 / 6.3 | 13.3 / 1.6 | 11.7 / 9.5 | 7.7 / 0 | 4.6 / 0 | 4.6 / 0 | 5.6 / 6.3 |
| BED-02 | McElroy 2016, study 1 (SPD489-343) | 39.6 / 8.6 | 8.9 / 3.2 | 17.7 / 7.5 | 13.5 / 9.1 | 8.3 / 7.5 | 6.8 / 1.1 | 5.7 / 1.1 | 8.3 / 7 |
| BED-03 | McElroy 2016, study 2 (SPD489-344) | 33.1 / 5.9 | 6.1 / 1.6 | 10.5 / 3.2 | 17.7 / 8.6 | 8.8 / 4.3 | nr | 5.5 / 0 | nr |
| BED-04 | Hudson 2017 (SPD489-346) | 5.1 / 1.5 | 0 / 0 | 0.7 / 1.5 | 8.8 / 6.7 | 4.4 / 2.2 | 1.5 / 1.5 | 0 / 0 | 2.9 / 3 |
| BED-06 | Grilo 2024 | 18.8 / 3.4 | 31.2 / 13.8 | 18.8 / 13.8 | nr | nr | nr | 6.2 / 0 | nr |
| OTH-01 | Trivedi 2013 (SPD489-206) | 11.4 / 0 | 6.8 / 2.4 | 4.5 / 7.1 | 11.4 / 4.7 | nr | nr | nr | nr |
| OTH-02 | Madhoo 2014 | 15.5 / 8.3 | 22.5 / 4.2 | 14.1 / 2.8 | 22.5 / 15.3 | 7 / 5.6 | 8.5 / 5.6 | 2.8 / 1.4 | 12.7 / 6.9 |
| OTH-03 | Richards 2016, study 1 (SPD489-322) | 9.5 / 3 | 7.5 / 4 | 9.5 / 7.5 | 6.5 / 10.4 | 6.5 / 5 | nr | nr | nr |
| OTH-04 | Richards 2016, study 2 (SPD489-323) | 11.8 / 2.8 | 6.2 / 2.3 | 5.2 / 3.3 | 11.8 / 7.5 | nr | nr | nr | nr |
| OTH-05 | Richards 2017 (SPD489-321) | 7.7 / 1.3 | 5.8 / 1.3 | 8.4 / 2.6 | 7.4 / 12.8 | 5.8 / 1.3 | nr | nr | nr |
| OTH-06 | McLean Hospital trial (unpublished) | 25 / 3.6 | 28.6 / 7.1 | 35.7 / 10.7 | 10.7 / 17.9 | nr | 14.3 / 14.3 | nr | 10.7 / 0 |
| OTH-08 | Lasser 2013 | 2.9 / 0 | 0 / 0 | 0 / 0 | 5.9 / 5.7 | 5.9 / 2.9 | 2.9 / 0 | nr | 2.9 / 0 |
| OTH-09 | Martin 2014 (schizophrenia) | 12.5 / 0 | 16.7 / 0 | 20.8 / 0 | 16.7 / 14.3 | 16.7 / 14.3 | 16.7 / 0 | nr | nr |
| OTH-10 | Mooney 2015 | nr | nr | 31.8 / 9.5 | 45.5 / 9.5 | 22.7 / 4.8 | 31.8 / 4.8 | nr | nr |
| OTH-11 | Ezard 2025 (LiMA) | 4 / 3.8 | nr | 8 / 3.8 | 34.7 / 26.2 | 16 / 5 | 6.7 / 5 | nr | nr |
| OTH-12 | Morrow 2013 | 36.6 / 9.1 | 26.8 / 4.5 | nr | 19.5 / 4.5 | 12.2 / 4.5 | 12.2 / 0 | nr | nr |
| OTH-14 | Young 2013 | 13.3 / 0 | 6.7 / 0 | 13.3 / 0 | 26.7 / 18.2 | 6.7 / 0 | 6.7 / 0 | nr | nr |
| OTH-18 | Metcalf 2024 | 20.9 / 0 | nr | nr | nr | 2.3 / 0 | nr | 7 / 3.4 | nr |
| OTH-20 | Yale bariatric trial (unpublished) | 77.8 / 14.3 | 77.8 / 0 | 33.3 / 14.3 | nr | nr | 33.3 / 14.3 | 22.2 / 14.3 | nr |

## Serious and notable events with LDX (placebo-controlled phases)

| ID | Event(s) in the LDX arm | Placebo arm |
|---|---|---|
| ADHD-01 | 2 SAEs, both judged unrelated: injuries in a car accident; postoperative knee pain | 0 SAEs |
| BED-01 | Acute pancreatitis, appendicitis (30 mg); drug toxicity (70 mg) | 0 SAEs |
| BED-02 | Syncope (2), cholecystitis | Anaphylactic reaction, conversion disorder |
| BED-03 | Lumbar vertebral fracture | Fibula fracture, syncope, agitation, anxiety |
| BED-04 | Nerve-root compression, breast cancer (randomized-withdrawal phase) | 0 SAEs |
| BED-05 | 1 serious cardiovascular event; the participant stopped LDX and the event resolved fully (abstract only) | nr |
| OTH-02 | Loss of consciousness, suicidal ideation | Gastroenteritis, rhabdomyolysis, salmonellosis, pelvic inflammatory disease |
| OTH-03 | Appendicitis, accidental overdose, syncope | Vertigo, wound infection, laceration, syncope, major depression, suicide attempt, appendicectomy |
| OTH-04 | Accelerated hypertension | Suicidal ideation |
| OTH-05 | Cholecystitis (70 mg) | 0 SAEs |
| OTH-07 | 0 SAEs; 1 suspected misuse (abstract only) | nr |
| OTH-08 | Schizophrenia (exacerbation) | Schizophrenia, dyspepsia |
| OTH-09 | 0 SAEs. Non-serious "psychotic disorder" in 2 participants (1 at 150 mg, 1 at 200 mg); akathisia in 2 | 0 SAEs |
| OTH-10 | Angina, "possibly related"; the participant left the trial | Psychosis after a cocaine binge |
| OTH-11 | 5 SAEs in 4 participants: facial cellulitis, bipolar I disorder, intentional overdose, overdose (2) | Schizophrenia, substance-induced psychosis, Crohn's disease |
| OTH-12 | 0 SAEs. Non-serious "mania" in 4/41 (registry term) | 0 SAEs; "mania" in 1/22 |

## Vital signs and weight

| ID | Result (LDX vs placebo) |
|---|---|
| ADHD-01 | Pulse, LS mean change at endpoint: +2.8, +4.2, +5.2 bpm (30/50/70 mg) vs 0.0 bpm. SBP and DBP changes −0.5 to +1.6 mm Hg in all arms, with no significant difference. QTcF changes similar to placebo. Weight −2.8 to −4.3 lb vs +0.5 lb. |
| ADHD-02 | Crossover-phase pulse 77.0–81.0 bpm on LDX vs 71.4–74.8 bpm on placebo. QTcF 388.8 vs 389.0 ms. |
| ADHD-11 | Mean change: pulse +6.7 vs −2.2 bpm; DBP +4.3 vs −6.6 mm Hg; SBP −1.2 vs −5.0 mm Hg (all P ≤ .05). |
| BED-01 | Weight change −3.1, −4.9, −4.9 kg (30/50/70 mg) vs −0.1 kg. |
| BED-02, BED-03 | Mean increase with LDX: pulse +4.41 to +6.31 bpm, SBP +0.2 to +1.45 mm Hg, DBP +1.06 to +1.83 mm Hg. |
| BED-06 | Weight −2.3 % with LDX vs +2.2 % with placebo over 12 weeks. |
| OTH-01 | Mean change: heart rate +4.8 vs −0.4 bpm; SBP +2.3 vs +0.5 mm Hg; DBP +0.9 vs −1.0 mm Hg; QTcF −4.9 vs −1.6 ms. |
| OTH-05 | Mean change (all LDX doses): pulse +3.6 vs +0.2 bpm; SBP +1.9 vs −0.7 mm Hg; DBP +0.8 vs −0.3 mm Hg. All three increase linearly with dose. |
| OTH-09 | Pulse change up to +21.3 bpm with LDX vs up to +14.4 bpm with placebo, across doses up to 250 mg. Blood pressure does not increase with dose. |
| OTH-10 | No difference in blood pressure, heart rate or weight. |
| OTH-11 | DBP higher with LDX at weeks 5 and 8 (maximum difference 4.0 mm Hg). No clear difference in heart rate or SBP. Hypertension AE 4 % vs 5 %. |
| OTH-16 | SBP (p = 0.017) and heart rate (p = 0.006) increase significantly with LDX; means stay in the normal range. |

## Trials not included, or included without usable AE data

| Trial | Reason |
|---|---|
| Van Ameringen, ADHD + anxiety/depression, crossover (NCT01863459) | No registry results; results only in a 2017 conference abstract that I could not access |
| Tavajohi 2025, MS fatigue (OTH-13) | Full text is paywalled; the abstract gives no AE data |
| Haghighi 2021, premature ejaculation (OTH-19) | The publication reports no AE data |
| Guerdjikova 2016 (BED-05), McElroy 2015 bipolar (OTH-07) | Full text is paywalled; only the abstract data are in the CSV |
| NCT02034201, methamphetamine (n = 19) | Completed; no results posted, no publication found |
| NCT01131559, bipolar depression | Terminated; no results posted |
| NCT01051440, bipolar depression MRI | Terminated with 2 participants |
| NCT01738698, NCT01760889, NCT01234298, NCT01986777 | Withdrawn, or no participant randomized |
| NCT05854667, NCT06788587 (methamphetamine), NCT06847399 (BED), methamphetamine-withdrawal trial (PMID 41309470) | Ongoing; no results |
| NCT03924193, Grilo acute BED trial | No placebo arm (LDX vs CBT vs LDX + CBT) |
| NCT01816074, mothers with ADHD | No placebo arm |
| NCT00573859, smoking in adult ADHD | Mixed ADHD drugs, not LDX only |
| NCT01415440 and other trials in children or adolescents | Not an adult population |
| NCT01096680 (sleep loss), Ermer 2020, Dolder 2017–2019, older-adult PK study | Healthy volunteers, not an indication |
| Jasinski 2009 (oral and IV abuse liability) | Abuse-liability studies in people with stimulant abuse histories, not an indication |

## Limits of this collection

- I searched ClinicalTrials.gov, PubMed and the open web. I did not search Embase, Cochrane CENTRAL, the WHO ICTRP, the EU Clinical Trials Register or the Japanese jRCT. Trials that only these sources list can be missing.
- Shire or Takeda funded most of the large trials.
- For ADHD-11 (Adler 2021), the publication gives percentages with no denominator.
- For OTH-10 (Mooney 2015), the counts come from the published percentages (21 placebo, 22 LDX). The registry lists no non-serious AEs for this trial.
- For OTH-02 (Madhoo 2014), the publication gives a serious-AE rate of 4.2 % with placebo. The registry lists 4/72 (5.6 %).
- For OTH-18 (Metcalf 2024), the registry groups are dose levels, so one participant can be in more than one LDX row.
- For ADHD-06, the registry age range is 18–24 years. The publication gives 18–26 years.

## Sources

[`SOURCES.md`](SOURCES.md) has the full citations, links and search queries.

Registry records: `https://clinicaltrials.gov/study/<NCT number>` for each NCT number in Table 1. Australian record: ACTRN12617000657325.

Publications (PubMed IDs): 19012818, 20576091, 22780921, 23945447, 24297663, 22277301, 22166471, 22508760, 24796970, 32297783, 34232582, 25587645, 26346638, 28700805, 27650406, 39258475, 35013131, 24021497, 24309905, 27474961, 28857719, 25340384, 23756608, 25310201, 26116930, 39701142, 23001556, 40582077, 23062791, 24988121, 26063677, 39146756, 34356237.
