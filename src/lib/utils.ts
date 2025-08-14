import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date in a standard way
 */
export function formatDate(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date showing only month and day
 */
export function formatDateShort(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format time from a date (HH:MM AM/PM)
 */
export function formatTime(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Calculate time elapsed in human-readable format (e.g., "2 hours ago")
 */
export function timeElapsed(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";

  const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} ${interval === 1 ? "year" : "years"} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} ${interval === 1 ? "month" : "months"} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} ${interval === 1 ? "day" : "days"} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} ${interval === 1 ? "hour" : "hours"} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} ${interval === 1 ? "minute" : "minutes"} ago`;

  return "Just now";
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate days ago from a given date
 */
export function getDaysAgo(date: Date | string): number {
  if (!date) return 0;

  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return 0;

  return daysBetween(d, new Date());
}

/**
 * Format a number with commas (e.g., 1,234)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Get a color based on symptom severity level (for concussion symptoms)
 */
export function getSymptomSeverityColor(value: number): string {
  switch (value) {
    case 0: return '#e5e5e5';
    case 1: return '#c6e5b3';
    case 2: return '#a3d86c';
    case 3: return '#ffdc72';
    case 4: return '#ffa64d';
    case 5: return '#ff704d';
    case 6: return '#e60000';
    default: return '#e5e5e5';
  }
}

/**
 * Get textual description of symptom severity
 */
export function getSymptomSeverityText(value: number): string {
  switch (value) {
    case 0: return 'None';
    case 1: return 'Very Mild';
    case 2: return 'Mild';
    case 3: return 'Moderate';
    case 4: return 'Significant';
    case 5: return 'Severe';
    case 6: return 'Very Severe';
    default: return 'Unknown';
  }
}

/**
 * Alias for getSymptomSeverityColor
 */
export function getSeverityColor(score: number): string {
  return getSymptomSeverityColor(score);
}

/**
 * Get the color for a recovery progress percentage
 */
export function getRecoveryProgressColor(percentage: number): string {
  if (percentage >= 80) return "#22c55e";
  if (percentage >= 60) return "#84cc16";
  if (percentage >= 40) return "#f59e0b";
  if (percentage >= 20) return "#f97316";
  return "#ef4444";
}

/**
 * Get color based on risk level
 */
export function getRiskLevelColor(riskLevel: 'critical' | 'recovering' | 'stable' | 'waiting'): string {
  switch (riskLevel) {
    case 'critical': return 'bg-red-500 text-white';
    case 'recovering': return 'bg-amber-500 text-white';
    case 'stable': return 'bg-green-500 text-white';
    case 'waiting': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

/**
 * Get risk level label
 */
export function getRiskLevelText(level: string): string {
  switch (level) {
    case 'critical': return 'Critical';
    case 'recovering': return 'Recovering';
    case 'stable': return 'Stable';
    case 'waiting': return 'Waiting for Digital Intake';
    default: return 'Unknown';
  }
}

/**
 * Parse unique symptom categories from PCSS (Post-Concussion Symptom Scale)
 */
export function parseSymptomCategories(symptoms: any[]): string[] {
  const categorySet = new Set<string>();
  symptoms.forEach(symptom => {
    if (symptom.category) categorySet.add(symptom.category);
  });
  return Array.from(categorySet);
}

/**
 * Group symptoms by their category
 */
export function groupSymptomsByCategory(symptoms: any[]): Record<string, any[]> {
  const categories: Record<string, any[]> = {
    Physical: [],
    Cognitive: [],
    Sleep: [],
    Emotional: [],
  };

  symptoms.forEach(symptom => {
    const category = symptom.category || 'Other';
    if (!categories[category]) categories[category] = [];
    categories[category].push(symptom);
  });

  return categories;
}

/**
 * Calculate age from date of birth
 */
export function getAge(dateOfBirth: Date | string): number {
  const birthDate = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  if (isNaN(birthDate?.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculate average symptom severity by category
 */
export function calculateAverageByCategoryFromSymptoms(symptoms: any[]): Record<string, number> {
  const categorySums: Record<string, { sum: number; count: number }> = {};

  symptoms.forEach(symptom => {
    const cat = symptom.category || "Other";
    if (!categorySums[cat]) categorySums[cat] = { sum: 0, count: 0 };
    categorySums[cat].sum += symptom.severity;
    categorySums[cat].count++;
  });

  const result: Record<string, number> = {};
  for (const cat in categorySums) {
    const { sum, count } = categorySums[cat];
    result[cat] = Math.round(sum / count);
  }

  return result;
}

/**
 * Get full name from first and last name
 */
export function getFullName(firstName: string, lastName?: string): string {
  return `${firstName || ""} ${lastName || ""}`.trim();
}

/**
 * Get symptom data from checkins - formatted for charts
 */
export function getSymptomData(checkins: any[]) {
  const labels = checkins.map(checkin => {
    const date = new Date(checkin.checkInDate);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const data = checkins.map(checkin => {
    if (!checkin.symptoms) return 0;
    return checkin.symptoms.reduce((sum: number, symptom: any) => sum + symptom.value, 0);
  });

  return { labels, data };
}

/**
 * Get sample symptoms data for display
 */
export function getSampleSymptoms() {
  return [
    { category: "Physical", name: "Headache", value: 3 },
    { category: "Physical", name: "Nausea", value: 2 },
    { category: "Physical", name: "Vomiting", value: 0 },
    { category: "Physical", name: "Balance problems", value: 2 },
    { category: "Physical", name: "Dizziness", value: 3 },
    { category: "Physical", name: "Visual problems", value: 1 },
    { category: "Physical", name: "Fatigue", value: 3 },
    { category: "Physical", name: "Sensitivity to light", value: 4 },
    { category: "Physical", name: "Sensitivity to noise", value: 3 },
    { category: "Physical", name: "Numbness/Tingling", value: 1 },

    { category: "Cognitive", name: "Feeling mentally foggy", value: 3 },
    { category: "Cognitive", name: "Feeling slowed down", value: 2 },
    { category: "Cognitive", name: "Difficulty concentrating", value: 3 },
    { category: "Cognitive", name: "Difficulty remembering", value: 2 },
    { category: "Cognitive", name: "Confusion", value: 1 },

    { category: "Sleep", name: "Drowsiness", value: 2 },
    { category: "Sleep", name: "Trouble falling asleep", value: 3 },
    { category: "Sleep", name: "Sleeping more than usual", value: 2 },
    { category: "Sleep", name: "Sleeping less than usual", value: 0 },

    { category: "Emotional", name: "Irritability", value: 2 },
    { category: "Emotional", name: "Sadness", value: 1 },
    { category: "Emotional", name: "Nervousness", value: 2 },
    { category: "Emotional", name: "More emotional", value: 1 },
  ];
}
