import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PropertyForm from '../../components/property/PropertyForm';
import propertyService, { resolveOwnerProfile } from '../../services/propertyService';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [submitting, setSubmitting] = React.useState(false);

  return (
    <DashboardLayout
      title="Add Property"
      subtitle="Fill in the details below and publish when ready"
    >
      <PropertyForm
        submitting={submitting}
        submitLabel="Publish property"
        onSubmit={async (values) => {
          setSubmitting(true);
          const owner = resolveOwnerProfile(user);
          const createdProperty = await propertyService.create(values, owner);
          setSubmitting(false);
          navigate(`/properties/${createdProperty.id}`);
        }}
      />
    </DashboardLayout>
  );
};

export default AddProperty;