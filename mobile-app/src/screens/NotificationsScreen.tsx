import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigations/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import BottomNavigationBar from "../components/BottomNavigationBar";
import api from "../services/api";

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Notifications"
>;

interface Props {
  navigation: NotificationsScreenNavigationProp;
}

export interface NotificationItem {
  id: string;
  type: "disruption" | "reroute" | "transfer" | "completed" | "saved" | "info";
  title: string;
  message: string;
  time: string;
  section: "TODAY" | "YESTERDAY" | "EARLIER";
  read: boolean;
  actionType?: "routeResults" | "liveTracking" | "journeys" | "detail";
  routeParams?: {
    from?: string;
    to?: string;
    tab?: "upcoming" | "completed" | "saved";
  };
}

export default function NotificationsScreen({ navigation }: Props) {
  const { isDarkMode, colors } = useTheme();
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    // TODAY
    {
      id: "notif-1",
      type: "disruption",
      title: "Journey disruption",
      message: "Your train is delayed by 15 minutes.",
      time: "10 min ago",
      section: "TODAY",
      read: false,
      actionType: "detail",
      routeParams: { from: "Kandy", to: "Colombo Fort" },
    },
    {
      id: "notif-2",
      type: "reroute",
      title: "Alternative route found",
      message: "BestRoute has found a safer connection via bus.",
      time: "30 min ago",
      section: "TODAY",
      read: false,
      actionType: "routeResults",
      routeParams: { from: "Kandy", to: "Colombo Fort" },
    },
    {
      id: "notif-3",
      type: "transfer",
      title: "Upcoming transfer",
      message: "Your train departs in 8 minutes. Head to Platform 1.",
      time: "1h ago",
      section: "TODAY",
      read: false,
      actionType: "liveTracking",
      routeParams: { from: "Kandy", to: "Colombo Fort" },
    },
    // YESTERDAY
    {
      id: "notif-4",
      type: "completed",
      title: "Journey completed",
      message: "Your journey to Colombo Fort is complete. Arrived on time.",
      time: "8:30 AM",
      section: "YESTERDAY",
      read: true,
      actionType: "journeys",
      routeParams: { tab: "completed" },
    },
    {
      id: "notif-5",
      type: "saved",
      title: "Route saved",
      message: "Kandy → Colombo Fort has been added to favourites.",
      time: "7:55 AM",
      section: "YESTERDAY",
      read: true,
      actionType: "journeys",
      routeParams: { tab: "saved" },
    },
    // EARLIER
    {
      id: "notif-6",
      type: "info",
      title: "Express service updated",
      message: "New highway buses added between Kandy & Colombo Central.",
      time: "Mon · 2:10 PM",
      section: "EARLIER",
      read: true,
      actionType: "routeResults",
      routeParams: { from: "Kandy", to: "Colombo Fort" },
    },
  ]);

  const [selectedDisruption, setSelectedDisruption] = useState<NotificationItem | null>(null);
  const [isDisruptionModalVisible, setIsDisruptionModalVisible] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getNotifications();
        if (res.success && Array.isArray(res.data?.notifications) && res.data.notifications.length > 0) {
          const apiNotifs: NotificationItem[] = res.data.notifications.map((n: any, idx: number) => ({
            id: n._id || `api-notif-${idx}`,
            type: n.type || "info",
            title: n.title || "Transit Update",
            message: n.message || "",
            time: "Just now",
            section: "TODAY" as const,
            read: !!n.read,
          }));
          setNotifications((prev) => {
            // Merge unique
            const existingIds = new Set(apiNotifs.map((an) => an.id));
            const filteredPrev = prev.filter((p) => !existingIds.has(p.id));
            return [...apiNotifs, ...filteredPrev];
          });
        }
      } catch {
        // Fallback to local default notifications
      }
    })();
  }, []);

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.markAllNotificationsRead();
    } catch {
      // ignore
    }
  };

  const handleItemPress = async (item: NotificationItem) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );

    try {
      if (item.id && !item.id.startsWith("notif-")) {
        await api.markNotificationRead(item.id);
      }
    } catch {
      // ignore
    }

    if (item.type === "disruption") {
      setSelectedDisruption(item);
      setIsDisruptionModalVisible(true);
      return;
    }

    if (item.actionType === "routeResults" && item.routeParams) {
      navigation.navigate("RouteResults", {
        from: item.routeParams.from,
        to: item.routeParams.to,
        skipLoading: false,
      });
    } else if (item.actionType === "liveTracking" && item.routeParams) {
      navigation.navigate("LiveTracking", {
        from: item.routeParams.from,
        to: item.routeParams.to,
      });
    } else if (item.actionType === "journeys") {
      navigation.navigate("Journeys", {
        initialTab: item.routeParams?.tab || "completed",
      });
    }
  };

  const getIconConfig = (type: NotificationItem["type"]) => {
    switch (type) {
      case "disruption":
        return {
          emoji: "⚠️",
          titleColor: isDarkMode ? "#F87171" : "#DC2626",
          bgColor: isDarkMode ? "rgba(220, 38, 38, 0.18)" : "#FEF2F2",
          borderColor: isDarkMode ? "rgba(220, 38, 38, 0.35)" : "#FEE2E2",
        };
      case "reroute":
        return {
          emoji: "🔄",
          titleColor: isDarkMode ? "#60A5FA" : "#2563EB",
          bgColor: isDarkMode ? "rgba(37, 99, 235, 0.18)" : "#EFF6FF",
          borderColor: isDarkMode ? "rgba(37, 99, 235, 0.35)" : "#DBEAFE",
        };
      case "transfer":
        return {
          emoji: "🔔",
          titleColor: isDarkMode ? "#C084FC" : "#7C3AED",
          bgColor: isDarkMode ? "rgba(124, 58, 237, 0.18)" : "#F5F3FF",
          borderColor: isDarkMode ? "rgba(124, 58, 237, 0.35)" : "#EDE9FE",
        };
      case "completed":
        return {
          emoji: "✓",
          titleColor: isDarkMode ? "#4ADE80" : "#16A34A",
          bgColor: isDarkMode ? "rgba(22, 163, 74, 0.18)" : "#F0FDF4",
          borderColor: isDarkMode ? "rgba(22, 163, 74, 0.35)" : "#DCFCE7",
        };
      case "saved":
        return {
          emoji: "⭐",
          titleColor: isDarkMode ? "#FBBF24" : "#D97706",
          bgColor: isDarkMode ? "rgba(217, 119, 6, 0.18)" : "#FEFCE8",
          borderColor: isDarkMode ? "rgba(217, 119, 6, 0.35)" : "#FEF08A",
        };
      case "info":
      default:
        return {
          emoji: "ℹ️",
          titleColor: isDarkMode ? "#38BDF8" : "#0284C7",
          bgColor: isDarkMode ? "rgba(2, 132, 199, 0.18)" : "#F0F9FF",
          borderColor: isDarkMode ? "rgba(2, 132, 199, 0.35)" : "#E0F2FE",
        };
    }
  };

  // Group notifications
  const todayList = notifications.filter((n) => n.section === "TODAY");
  const yesterdayList = notifications.filter((n) => n.section === "YESTERDAY");
  const earlierList = notifications.filter((n) => n.section === "EARLIER");

  const renderSection = (title: string, list: NotificationItem[]) => {
    if (list.length === 0) return null;
    return (
      <View style={styles.sectionWrap} key={title}>
        <Text
          style={[
            styles.sectionHeading,
            isDarkMode && { color: colors.textSecondary },
          ]}
        >
          {title}
        </Text>
        {list.map((item) => {
          const config = getIconConfig(item.type);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                isDarkMode && {
                  backgroundColor: colors.cardBg,
                  borderColor: item.read ? colors.cardBorder : "#3B82F6",
                },
                !item.read && !isDarkMode && styles.cardUnread,
              ]}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              {/* Icon Container */}
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: config.bgColor,
                    borderColor: config.borderColor,
                  },
                ]}
              >
                <Text style={styles.iconEmoji}>{config.emoji}</Text>
              </View>

              {/* Text Body */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                  <Text
                    style={[styles.cardTitle, { color: config.titleColor }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardTimestamp,
                      isDarkMode && { color: colors.textMuted },
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardMessage,
                    isDarkMode && { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.message}
                </Text>
              </View>

              {/* Unread Accent Dot */}
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.screenBg }]}
      edges={["top"]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Screen Header - Safe distance below dynamic island / notch */}
      <View
        style={[
          styles.header,
          isDarkMode && { backgroundColor: colors.headerBg },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            isDarkMode && { color: colors.textPrimary },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          Notifications
        </Text>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            activeOpacity={0.7}
            style={[
              styles.markAllReadBtn,
              isDarkMode && {
                backgroundColor: colors.cardSecondaryBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
          {/* Dark Mode Change Button Displayed in Top Right Corner */}
          <ThemeToggle variant="solid" size={38} />
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={[
          styles.scrollList,
          isDarkMode && { backgroundColor: colors.screenBg },
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderSection("TODAY", todayList)}
        {renderSection("YESTERDAY", yesterdayList)}
        {renderSection("EARLIER", earlierList)}

        {notifications.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text
              style={[
                styles.emptyTitle,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              No Notifications
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                isDarkMode && { color: colors.textSecondary },
              ]}
            >
              You're all caught up! Important journey disruptions and transit
              updates will appear here.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Unified Fixed-Position Bottom Navigation Bar */}
      <BottomNavigationBar
        activeTab="alerts"
        navigation={navigation}
        unreadAlertsCount={unreadCount}
      />

      {/* ================= DISRUPTION DETAIL MODAL ================= */}
      <Modal
        visible={isDisruptionModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsDisruptionModalVisible(false)}
      >
        <SafeAreaView
          style={[
            styles.modalSafeArea,
            isDarkMode && { backgroundColor: colors.modalBg },
          ]}
          edges={["top", "bottom"]}
        >
          <View
            style={[
              styles.modalHeader,
              isDarkMode && { borderBottomColor: colors.cardBorder },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                isDarkMode && { backgroundColor: colors.cardSecondaryBg },
              ]}
              onPress={() => setIsDisruptionModalVisible(false)}
            >
              <Text
                style={[
                  styles.modalCloseText,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.modalHeaderTitle,
                isDarkMode && { color: colors.textPrimary },
              ]}
            >
              Transit Alert
            </Text>
            <View style={{ width: 32 }} />
          </View>

          {selectedDisruption && (
            <View style={styles.modalContent}>
              <View
                style={[
                  styles.modalAlertIconBox,
                  isDarkMode && {
                    backgroundColor: "rgba(239, 68, 68, 0.18)",
                    borderColor: "rgba(239, 68, 68, 0.35)",
                  },
                ]}
              >
                <Text style={styles.modalBigEmoji}>⚠️</Text>
              </View>

              <Text
                style={[
                  styles.modalAlertHeading,
                  isDarkMode && { color: colors.textPrimary },
                ]}
              >
                Main Line Train Delay
              </Text>
              <Text
                style={[
                  styles.modalAlertSub,
                  isDarkMode && { color: colors.textSecondary },
                ]}
              >
                Train #1008 from Kandy to Colombo Fort is experiencing a 15-minute
                delay due to track maintenance near Polgahawela Junction.
              </Text>

              <View
                style={[
                  styles.impactCard,
                  isDarkMode && {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.impactCardTitle,
                    isDarkMode && { color: colors.textMuted },
                  ]}
                >
                  Affected Route
                </Text>
                <Text
                  style={[
                    styles.impactCardDetail,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  Kandy → Colombo Fort (Scheduled 08:30 AM)
                </Text>
                <Text
                  style={[
                    styles.impactEstimatedArrival,
                    isDarkMode && { color: "#F87171" },
                  ]}
                >
                  New Estimated Arrival: 10:20 AM (+15 min)
                </Text>
              </View>

              <View
                style={[
                  styles.alternativeSuggestionBox,
                  isDarkMode && {
                    backgroundColor: "rgba(37, 99, 235, 0.15)",
                    borderColor: "rgba(59, 130, 246, 0.35)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.altBadge,
                    isDarkMode && { color: colors.primaryLight },
                  ]}
                >
                  RECOMMENDED ALTERNATIVE
                </Text>
                <Text
                  style={[
                    styles.altText,
                    isDarkMode && { color: colors.textPrimary },
                  ]}
                >
                  Direct AC Express Bus 01 departs in 12 mins from Kandy Goodshed
                  Bus Stand with no delays reported.
                </Text>
              </View>

              <View style={styles.modalButtonStack}>
                <TouchableOpacity
                  style={styles.modalAltBtn}
                  onPress={() => {
                    setIsDisruptionModalVisible(false);
                    navigation.navigate("RouteResults", {
                      from: selectedDisruption.routeParams?.from || "Kandy",
                      to: selectedDisruption.routeParams?.to || "Colombo Fort",
                      skipLoading: false,
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalAltBtnText}>
                    View Bus Route (Saves 10m)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalDismissBtn,
                    isDarkMode && {
                      backgroundColor: colors.cardSecondaryBg,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                  onPress={() => setIsDisruptionModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.modalDismissBtnText,
                      isDarkMode && { color: colors.textSecondary },
                    ]}
                  >
                    Keep Current Route
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    flex: 1,
    marginRight: 8,
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  markAllReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  markAllReadText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "center",
  },
  // Scroll list
  scrollList: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 95,
  },
  // Section Headers
  sectionWrap: {
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 6,
  },
  // Cards
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 11,
    position: "relative",
    ...Platform.select({
      ios: {
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardUnread: {
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#2563EB",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
    paddingRight: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  cardTimestamp: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },
  cardMessage: {
    fontSize: 13.5,
    color: "#64748B",
    lineHeight: 18.5,
    fontWeight: "400",
  },
  // Empty State
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 70,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  // Bottom Navigation Bar
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 22 : 10,
    paddingHorizontal: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navIconActive: {
    color: "#1D64EC",
  },
  navIconInactive: {
    color: "#94A3B8",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  navLabelActive: {
    color: "#1D64EC",
    fontWeight: "700",
  },
  navLabelInactive: {
    color: "#94A3B8",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -4,
    width: 26,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: "#1D64EC",
  },
  alertIconWrapper: {
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  // Modal
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "700",
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalContent: {
    padding: 22,
    flex: 1,
  },
  modalAlertIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalBigEmoji: {
    fontSize: 32,
  },
  modalAlertHeading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
  },
  modalAlertSub: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },
  impactCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 14,
  },
  impactCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  impactCardDetail: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  impactEstimatedArrival: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  alternativeSuggestionBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  altBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  altText: {
    fontSize: 13.5,
    color: "#1E40AF",
    lineHeight: 19,
    fontWeight: "500",
  },
  modalButtonStack: {
    marginTop: "auto",
    paddingBottom: 16,
  },
  modalAltBtn: {
    backgroundColor: "#1D64EC",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalAltBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  modalDismissBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDismissBtnText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
});
