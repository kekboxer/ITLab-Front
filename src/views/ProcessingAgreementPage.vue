<!-- TEMPLATE BEGIN -->
<template>
  <div class="processing-agreement-page fullscreen-height">
    <b-container class="fullscreen-height">
      <b-row align-v="center" align-h="center" class="fullscreen-height">
        <b-col class="card">
          <b-container>
            <b-row>
              <b-col>
                <h1>Согласие на обработку персональных данных</h1>
                <hr>
                <p>
                  Предоставляя свои персональные данные Пользователь даёт согласие на обработку, хранение и использование своих персональных данных на основании ФЗ № 152-ФЗ «О персональных данных» от 27.07.2006 г. в следующих целях:
                  <br>
                  <ul>
                    <li>Осуществление клиентской поддержки</li>
                    <li>Получения Пользователем информации о маркетинговых событиях</li>
                    <li>Проведения аудита и прочих внутренних исследований с целью повышения качества предоставляемых услуг.</li>
                  </ul>
                </p>
                <p>
                  Под персональными данными подразумевается любая информация личного характера, позволяющая установить личность Пользователя/Покупателя такая как:
                  <br>
                  <ul>
                    <li>Имя</li>
                    <li>Фамилия</li>
                    <li>Контактный телефон</li>
                    <li>Адрес электронной почты</li>
                    <li>Номер студенческого билета</li>
                  </ul>
                  Персональные данные Пользователей хранятся исключительно на электронных носителях и обрабатываются с использованием автоматизированных систем, за исключением случаев, когда неавтоматизированная обработка персональных данных необходима в связи с исполнением требований законодательства.
                </p>
                <p>
                  Компания обязуется не передавать полученные персональные данные третьим лицам, за исключением следующих случаев:
                  <br>
                  <ul>
                    <li>По запросам уполномоченных органов государственной власти РФ только по основаниям и в порядке, установленным законодательством РФ
                    </li>
                    <li>Стратегическим партнерам, которые работают с Компанией для предоставления продуктов и услуг, или тем из них, которые помогают Компании реализовывать продукты и услуги потребителям. Мы предоставляем третьим лицам минимальный объем персональных данных, необходимый только для оказания требуемой услуги или проведения необходимой транзакции.
                    </li>
                  </ul>
                </p>
                <p>
                  Компания оставляет за собой право вносить изменения в одностороннем порядке в настоящие правила, при условии, что изменения не противоречат действующему законодательству РФ. Изменения условий настоящих правил вступают в силу после их публикации на Сайте.
                </p>
                <hr>
              </b-col>
            </b-row>
            <b-row align-v="center" align-h="center">
              <b-col align="center">
                <b-button variant="primary" @click="navigateBack()">Назад</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { registerPage } from "@/router/PagesInformation";

@Component
class ProcessingAgreementPage extends Vue {
  navigateBack() {
    this.$router.go(-1)
  }
}

registerPage(
  {
    path: "/processing_agreement",
    name: "ProcessingAgreement",
    component: ProcessingAgreementPage
  },
  {
    secure: false,
    hideNavigation: true
  }
);

export default ProcessingAgreementPage;
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import "@/styles/theme.scss";

.processing-agreement-page .card {
  padding: 30px;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.125);

  @include theme-specific() {
    background-color: getstyle(auth-card-background-color);
  }
}
</style>
<!-- STYLE END -->
