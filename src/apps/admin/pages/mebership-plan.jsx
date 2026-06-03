import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast, Toaster } from "react-hot-toast";
import {
  createMembershipPlanApi,
  getAllMembershipPlansApi,
  updateMembershipPlanApi,
  updateMembershipPlanStatusApi
} from "../../../shared/api/admin/expertMembershipPlan.api";

/* ================= STYLED COMPONENTS ================= */
const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
`;

const AddPlanCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: end;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102,126,234,0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  
  &:hover {
    background: #5a6268;
    box-shadow: 0 5px 15px rgba(108,117,125,0.4);
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const PlanCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  }
`;

const PlanHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  color: white;
  position: relative;
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const PlanPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-top: 0.5rem;
  
  small {
    font-size: 0.875rem;
    font-weight: 400;
  }
`;

const Duration = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-top: 0.25rem;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.active ? '#10b981' : '#ef4444'};
`;

const PlanBody = styled.div`
  padding: 1.5rem;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EditButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: #5a67d8;
  }
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  background: ${props => props.active ? '#ef4444' : '#10b981'};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#dc2626' : '#059669'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 1.2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  color: #999;
`;

/* ================= MAIN COMPONENT ================= */
export default function MembershipPlansAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    plan_name: "",
    amount: "",
    duration_years: "",
    description: ""
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllMembershipPlansApi();
      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.plan_name || !formData.amount || !formData.duration_years) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      if (editingPlan) {
        // Update existing plan
        await updateMembershipPlanApi(editingPlan.id, {
          plan_name: formData.plan_name,
          amount: parseFloat(formData.amount),
          duration_years: parseInt(formData.duration_years),
          description: formData.description || null
        });
        toast.success("Plan updated successfully!");
      } else {
        // Create new plan
        await createMembershipPlanApi({
          plan_name: formData.plan_name,
          amount: parseFloat(formData.amount),
          duration_years: parseInt(formData.duration_years),
          description: formData.description || null
        });
        toast.success("Plan created successfully!");
      }
      
      // Reset form and refresh
      resetForm();
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      console.error(error);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      plan_name: plan.plan_name,
      amount: plan.amount,
      duration_years: plan.duration_years,
      description: plan.description || ""
    });
  };

  const handleToggleStatus = async (plan) => {
    try {
      const newStatus = plan.is_active === 1 ? 0 : 1;
      await updateMembershipPlanStatusApi(plan.id, { is_active: newStatus });
      toast.success(`Plan ${newStatus === 1 ? 'activated' : 'deactivated'} successfully!`);
      fetchPlans();
    } catch (error) {
      toast.error("Failed to update plan status");
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingPlan(null);
    setFormData({
      plan_name: "",
      amount: "",
      duration_years: "",
      description: ""
    });
  };

  return (
    <Container>
      <Toaster position="top-right" />
      <ContentWrapper>
        <Header>
          <Title>Membership Plans Management</Title>
          <Subtitle>Create, update, and manage expert subscription plans</Subtitle>
        </Header>

        {/* Add/Edit Plan Form */}
        <AddPlanCard>
          <SectionTitle>
            {editingPlan ? "✏️ Edit Plan" : "➕ Add New Plan"}
          </SectionTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Plan Name *</Label>
              <Input
                type="text"
                name="plan_name"
                placeholder="e.g., Basic, Pro, Enterprise"
                value={formData.plan_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Amount (₹) *</Label>
              <Input
                type="number"
                name="amount"
                placeholder="e.g., 2999"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="1"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Duration (Years) *</Label>
              <Input
                type="number"
                name="duration_years"
                placeholder="e.g., 1"
                value={formData.duration_years}
                onChange={handleInputChange}
                required
                min="1"
                step="1"
              />
            </FormGroup>
            
            <FormGroup style={{ gridColumn: "1/-1" }}>
              <Label>Description (Optional)</Label>
              <TextArea
                name="description"
                placeholder="Plan features and benefits..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            
            <FormGroup>
              {editingPlan && (
                <CancelButton type="button" onClick={resetForm}>
                  Cancel
                </CancelButton>
              )}
              <Button type="submit">
                {editingPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </FormGroup>
          </Form>
        </AddPlanCard>

        {/* Plans List */}
        <SectionTitle style={{ color: "white" }}>
          📋 Existing Plans ({plans.length})
        </SectionTitle>
        
        {loading ? (
          <LoadingSpinner>Loading plans...</LoadingSpinner>
        ) : plans.length === 0 ? (
          <EmptyState>
            No plans created yet. Create your first plan above!
          </EmptyState>
        ) : (
          <PlansGrid>
            {plans.map((plan) => (
              <PlanCard key={plan.id}>
                <PlanHeader>
                  <StatusBadge active={plan.is_active === 1}>
                    {plan.is_active === 1 ? "ACTIVE" : "INACTIVE"}
                  </StatusBadge>
                  <PlanName>{plan.plan_name}</PlanName>
                  <PlanPrice>
                    ₹{Number(plan.amount).toLocaleString()}
                    <small> / {plan.duration_years} year{plan.duration_years > 1 ? 's' : ''}</small>
                  </PlanPrice>
                  <Duration>Duration: {plan.duration_years} Year(s)</Duration>
                </PlanHeader>
                <PlanBody>
                  <Description>
                    {plan.description || "No description provided"}
                  </Description>
                  <ButtonGroup>
                    <EditButton onClick={() => handleEdit(plan)}>
                      ✏️ Edit
                    </EditButton>
                    <ToggleButton 
                      active={plan.is_active === 1}
                      onClick={() => handleToggleStatus(plan)}
                    >
                      {plan.is_active === 1 ? "🔴 Disable" : "🟢 Enable"}
                    </ToggleButton>
                  </ButtonGroup>
                </PlanBody>
              </PlanCard>
            ))}
          </PlansGrid>
        )}
      </ContentWrapper>
    </Container>
  );
}