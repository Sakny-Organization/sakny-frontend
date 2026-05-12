import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PropertyForm from '../../components/property/PropertyForm';
import propertyService from '../../services/propertyService';

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    propertyService.getById(id).then(setProperty);
  }, [id]);

  if (!property) {
    return null;
  }

  return (
    <DashboardLayout
      title="Edit Property"
      subtitle="Update your listing details below"
    >
      <PropertyForm
        initialValues={property}
        submitting={submitting}
        submitLabel="Update property"
        onSubmit={async (values) => {
          setSubmitting(true);
          await propertyService.update(id, values);
          setSubmitting(false);
          navigate(`/properties/${id}`);
        }}
      />
    </DashboardLayout>
  );
};

export default EditProperty;