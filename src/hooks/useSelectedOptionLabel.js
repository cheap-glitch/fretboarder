
/**
 * hooks/useSelectedOptionLabel.js
 */

import { ref, watchEffect, onMounted } from '@vue/composition-api'

import { formatOrdinalSuffix }         from '@/modules/text'

export function useSelectedOptionLabel(selectValue, labelFormatter)
{
	const select              = ref(null);
	const selectedOptionLabel = ref('');

	onMounted(() => {
		watchEffect(() => selectedOptionLabel.value = labelFormatter(selectValue.value, formatOrdinalSuffix(select.value.selectedOptions[0].label)));
	});

	return { select, selectedOptionLabel };
}
