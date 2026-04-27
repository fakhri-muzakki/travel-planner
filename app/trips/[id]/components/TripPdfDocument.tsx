// src/features/pdf/TripPdfDocument.tsx
"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { TripBudgetSummary, TripDay } from "@/types";

type Trip = {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  traveler_count: number;
  budget_per_person: number;
  currency: string;
  travel_styles: string[];
  pace: string;
  itinerary_days: TripDay[];
  itinerary_budget_summary: TripBudgetSummary[];
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 40,
    paddingHorizontal: 28,
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.45,
  },

  hero: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
  },

  badge: {
    color: "#67e8f9",
    fontSize: 8,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 4,
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 11,
    marginTop: 18,
  },

  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 10,
  },

  statLabel: {
    color: "#94a3b8",
    fontSize: 8,
    marginBottom: 4,
  },

  statValue: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
  },

  section: {
    marginTop: 12,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0891b2",
    marginBottom: 10,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  chip: {
    backgroundColor: "#ecfeff",
    color: "#0e7490",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 9,
  },

  summaryCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 14,
  },

  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  muted: {
    color: "#6b7280",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 6,
  },

  dayHeader: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  daySmall: {
    color: "#67e8f9",
    fontSize: 8,
    marginBottom: 4,
  },

  dayTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },

  dayDate: {
    color: "#cbd5e1",
    fontSize: 10,
  },

  hotelCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },

  hotelLabel: {
    color: "#6b7280",
    fontSize: 8,
    marginBottom: 4,
  },

  hotelName: {
    fontSize: 11,
    fontWeight: 700,
  },

  activityCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  slot: {
    color: "#0891b2",
    fontSize: 9,
    fontWeight: 700,
  },

  price: {
    color: "#0891b2",
    fontSize: 9,
    fontWeight: 700,
  },

  activityTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 4,
    marginBottom: 6,
  },

  tiny: {
    fontSize: 9,
    color: "#6b7280",
  },

  footer: {
    position: "absolute",
    bottom: 18,
    left: 28,
    right: 28,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

function money(value: number, currency: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function slotLabel(slot: string) {
  const map: Record<string, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Lunch",
    night: "Dinner",
  };

  return map[slot] ?? slot;
}

export default function TripPdfDocument({ trip }: { trip: Trip }) {
  const totalBudget = trip.budget_per_person * trip.traveler_count;

  return (
    <Document>
      {/* COVER PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.badge}>AI Generated Travel Plan</Text>

          <Text style={styles.title}>{trip.title}</Text>

          <Text style={styles.subtitle}>
            {trip.duration_days} Days in {trip.destination}
          </Text>

          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Dates</Text>
              <Text style={styles.statValue}>
                {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Travelers</Text>
              <Text style={styles.statValue}>{trip.traveler_count}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Pace</Text>
              <Text style={styles.statValue}>{trip.pace}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Budget</Text>
              <Text style={styles.statValue}>
                {money(totalBudget, trip.currency)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Styles</Text>

          <View style={styles.chipWrap}>
            {trip.travel_styles.map((style) => (
              <Text key={style} style={styles.chip}>
                {style}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Breakdown</Text>

          <View style={styles.summaryCard}>
            {trip.itinerary_budget_summary.map((item) => (
              <View key={item.id} style={styles.budgetRow}>
                <Text style={styles.muted}>{item.category}</Text>

                <Text>
                  {money(item.total_cost, trip.currency)} ({item.percentage}%)
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text>Total Budget</Text>
              <Text>{money(totalBudget, trip.currency)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated by Travel Planner • {new Date().toLocaleString()}
        </Text>
      </Page>

      {/* DAY PAGES */}
      {trip.itinerary_days.map((day) => (
        <Page key={day.id} size="A4" style={styles.page}>
          <View style={styles.dayHeader}>
            <Text style={styles.daySmall}>Day {day.day_number}</Text>

            <Text style={styles.dayTitle}>{day.day_theme}</Text>

            <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
          </View>

          <View style={styles.hotelCard}>
            <Text style={styles.hotelLabel}>Accommodation</Text>
            <Text style={styles.hotelName}>
              {day.accommodation?.name ?? "-"}
            </Text>
          </View>

          {day.itinerary_activities.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.slot}>{slotLabel(item.time_slot)}</Text>

                <Text style={styles.price}>
                  {money(item.estimated_cost, trip.currency)}
                </Text>
              </View>

              <Text style={styles.activityTitle}>{item.activity_name}</Text>

              <View style={styles.rowBetween}>
                <Text style={styles.tiny}>
                  Duration: {item.duration_minutes} min
                </Text>

                {/* <Text style={styles.tiny}>{item.tips ?? ""}</Text> */}
              </View>
            </View>
          ))}

          <Text style={styles.footer}>
            {trip.title} • Day {day.day_number}
          </Text>
        </Page>
      ))}
    </Document>
  );
}
