import type { BillingRepository } from "@/repositories/interfaces";
import type { SubscriptionPlan, UserSubscription } from "@/types";
import { mockPlans, mockSubscription } from "@/lib/constants/mock-data";

const subscriptionDb = { ...mockSubscription };

export class MockBillingRepository implements BillingRepository {
  async getPlans(): Promise<SubscriptionPlan[]> {
    return mockPlans;
  }

  async getSubscription(_userId: string): Promise<UserSubscription> {
    return subscriptionDb;
  }

  async createCheckoutSession(_userId: string, planId: string): Promise<{ checkoutUrl: string }> {
    const plan = mockPlans.find((item) => item.id === planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    if (plan.tier === "premium") {
      subscriptionDb.tier = "premium";
    }

    return { checkoutUrl: "/dashboard/settings?upgraded=true" };
  }

  async cancelSubscription(_userId: string): Promise<void> {
    subscriptionDb.cancelAtPeriodEnd = true;
    subscriptionDb.status = "canceled";
  }
}
