const subscriptionPlans = [
    {
        planId: 'USER_PREMIUM_MONTHLY',
        name: 'Premium Monthly',
        price: 499,
        durationDays: 30,
        features: ['View unmasked engineer phone numbers', 'Recent call history']
    },
    {
        planId: 'USER_PREMIUM_YEARLY',
        name: 'Premium Yearly',
        price: 4999,
        durationDays: 365,
        features: ['View unmasked engineer phone numbers', 'Recent call history']
    }
];

const findPlan = (planId) => subscriptionPlans.find((plan) => plan.planId === planId);

module.exports = {
    findPlan,
    subscriptionPlans
};
