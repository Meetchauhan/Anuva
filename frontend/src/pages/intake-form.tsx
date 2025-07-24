import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "../components/ui/form";
import { SymptomSlider } from "../components/ui/symptom-slider";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/collapsible"; // Import Collapsible components
import { SymptomTrajectory } from "../components/charts/symptom-trajectory";
import { useIntakeFormView } from "../config/apiQueries";

interface MetaPatient {
    id: number;
    fullName: string;
    dateOfExamination: string;
    race: string;
    maritalStatus: string;
    numberOfChildren: number;
    hearingImpairment: boolean;
    hearingAids: boolean;
    glassesOrContacts: boolean;
    occupation: string;
    employer: string;
    employerAddress: string;
    enrolledInSchool: boolean;
    school: string;
}

interface IntakeFormValues {
    patientID: number;
    injuryID: number;
    headache: number;
    pressureInHead: number;
    neckPain: number;
    troubleFallingAsleep: number;
    drowsiness: number;
    nauseaOrVomiting: number;
    fatigueOrLowEnergy: number;
    dizziness: number;
    blurredVision: number;
    balanceProblems: number;
    sensitivityToLight: number;
    sensitivityToNoise: number;
    feelingSlowedDown: number;
    feelingInAFog: number;
    dontFeelRight: number;
    difficultyConcentrating: number;
    difficultyRemembering: number;
    confusion: number;
    moreEmotional: number;
    irritability: number;
    sadnessOrDepression: number;
    nervousOrAnxious: number;
    worseWithPhysicalActivity: boolean;
    worseWithMentalActivity: boolean;
    TotalSymptoms: number;
    SymptomSeverityScore: number;
}

export default function IntakeFormPage() {
    const params = new URLSearchParams(window.location.search);
    const defaultPatient = parseInt(params.get("patientID") || "0", 10);
    const defaultInjury = parseInt(params.get("injuryID") || "0", 10);

    const requestID = parseInt(params.get("requestID") || "0", 10);

    const form = useForm<MetaPatient & IntakeFormValues>({
        defaultValues: {
            patientID: defaultPatient,
            injuryID: defaultInjury,
            headache: 0,
            pressureInHead: 0,
            neckPain: 0,
            troubleFallingAsleep: 0,
            drowsiness: 0,
            nauseaOrVomiting: 0,
            fatigueOrLowEnergy: 0,
            dizziness: 0,
            blurredVision: 0,
            balanceProblems: 0,
            sensitivityToLight: 0,
            sensitivityToNoise: 0,
            feelingSlowedDown: 0,
            feelingInAFog: 0,
            dontFeelRight: 0,
            difficultyConcentrating: 0,
            difficultyRemembering: 0,
            confusion: 0,
            moreEmotional: 0,
            irritability: 0,
            sadnessOrDepression: 0,
            nervousOrAnxious: 0,
            worseWithPhysicalActivity: false,
            worseWithMentalActivity: false,
            TotalSymptoms: 0,
            SymptomSeverityScore: 0,
        },
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadForm() {
            setLoading(false);
            const data = await useIntakeFormView(requestID);
            form.setValue("patientID" as any, data["id"])

            Object.entries(data).forEach(([key, value]) => {
                try {
                    form.setValue(key as any, value);
                }
                catch {
                    null;
                }
            });

            setLoading(false);
        }
        loadForm();
    }, [requestID]);

    const onSubmit = async (data: IntakeFormValues) => {
        try {
            const resp = await fetch(`${window.location.origin}/api/v2/intake-form/${requestID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!resp.ok) {
                throw new Error("Failed to submit form");
            }
            const result = await resp.json();
            const patientID = result["patientID"]
            alert(`Form submitted successfully. Patient ID: ${patientID}`);
        } catch (err: any) {
            alert(err.message || "Submission error");
        }
    };

    const patientFieldKeys = [
        "fullName",
        "dateOfExamination",
        "race",
        "maritalStatus",
        "numberOfChildren",
        "hearingImpairment",
        "hearingAids",
        "glassesOrContacts",
        "occupation",
        "employer",
        "employerAddress",
        "enrolledInSchool",
        "school"
    ] as const;

    const severityFields = [
        "headache",
        "pressureInHead",
        "neckPain",
        "troubleFallingAsleep",
        "drowsiness",
        "nauseaOrVomiting",
        "fatigueOrLowEnergy",
        "dizziness",
        "blurredVision",
        "balanceProblems",
        "sensitivityToLight",
        "sensitivityToNoise",
        "feelingSlowedDown",
        "feelingInAFog",
        "dontFeelRight",
        "difficultyConcentrating",
        "difficultyRemembering",
        "confusion",
        "moreEmotional",
        "irritability",
        "sadnessOrDepression",
        "nervousOrAnxious",
    ] as const;

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-normal">
            <div className="w-full max-w-2xl bg-card p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">Intake Symptom Checklist</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="patientID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patient ID</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="injuryID"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Injury ID</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Collapsible>
                            <CollapsibleTrigger>
                                <span>Click to expand patient details</span>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                {patientFieldKeys.map((key) => (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={key as any}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{key.replace(/([A-Z])/g, " $1").trim()}</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                        <Collapsible>
                            <CollapsibleTrigger>
                                <span>Click to expand symptoms</span>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                {severityFields.map((symptom) => (
                                    <FormField
                                        key={symptom}
                                        control={form.control}
                                        name={symptom as any}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{symptom.replace(/([A-Z])/g, " $1").trim()}</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center">
                                                        <div className="flex-1">
                                                            <SymptomSlider
                                                                name={field.name}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </div>
                                                        <span className="ml-4 text-sm font-medium w-12 text-right">
                                                            {field.value}
                                                        </span>
                                                    </div>
                                                </FormControl>
                                                <FormDescription>Severity (0–6)</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <FormField
                                    control={form.control}
                                    name="WorseWithPhysicalActivity"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Symptoms worse with physical activity?</FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="WorseWithMentalActivity"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Symptoms worse with mental activity?</FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                        <FormField
                            control={form.control}
                            name="TotalSymptoms"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Symptoms</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="SymptomSeverityScore"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Symptom Severity Score</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
